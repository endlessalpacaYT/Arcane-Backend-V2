const fetch = require("node-fetch");
const fs = require("fs/promises");
const path = require("path");
const uuid = require("uuid").v4;
const { config, logger } = require("..");
const { CosmeticTypes } = require("./enums/CosmeticTypes");
const { ShopHelper } = require("./helpers/shophelper");
const { createBattlePassEntryTemplate, createItemEntryTemplate } = require("./helpers/template");
const { setDisplayAsset, setNewDisplayAssetPath } = require("./helpers/displayAssets");
const { getPrice } = require("./helpers/itemprices");
const getRandomFullSetLength = require("./functions/getRandomFullSetLength");
const { matchRegex } = require("./functions/regex");

const items = {};
const sets = {};
const shop = createShop();

function createShop() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + 1);

  const expiration = date.toISOString();

  return {
    expiration: expiration.toString(),
    refreshIntervalHrs: 1,
    dailyPurchaseHrs: 24,
    storefronts: [],
  };
}

async function generate() {
  const date = new Date().toISOString().split("T")[0];

  const request = await fetch("https://fortnite-api.com/v2/cosmetics/br").then(async (res) => await res.json());

  const cosmeticTypes = {};

  const response = request.data;
  response.forEach((json) => {
    if (
      !json.introduction ||
      json.introduction.backendValue > config.currentSeason ||
      json.introduction.backendValue === 0 ||
      json.set === null ||
      !json.shopHistory
    ) return;

    if (json.shopHistory === null || json.shopHistory.length === 0) return;

    const itemType = json.type && typeof json.type === "object" ? json.type.backendValue : null;

    if (itemType && cosmeticTypes[itemType] !== undefined) {
      json.type.backendValue = cosmeticTypes[itemType];
    }

    if (!itemType) return;

    if (!sets[json.set.backendValue]) {
      sets[json.set.backendValue] = {
        value: json.set.value,
        text: json.set.text,
        definition: [],
      };
    }

    sets[json.set.backendValue].definition.push(json);
    items[json.id] = json;
  });

  const displayAssets = await fs.readFile(path.join(__dirname, "..", "memory", "displayAssets.json"), 'utf8').then(JSON.parse);

  for (const asset of Object.values(displayAssets)) {
    const assetParts = asset.split("_").slice(1);
    const itemKey = assetParts.join("_");
    let item = items[itemKey];

    if (!item && assetParts[0].includes("CID")) {
      const match = matchRegex(itemKey);

      if (match) {
        item = Object.values(items).find((item) => item.type.backendValue.includes("AthenaCharacter"));
      }
    }

    if (item) {
      item.NewDisplayAssetPath = asset;
    }
  }

  Object.values(items).filter(
    (item) => item.type.backendValue.includes("AthenaBackpack") && item.itemPreviewHeroPath
  ).forEach((item) => {
    const cosmeticId = item.itemPreviewHeroPath.split("/").at(-1);
    if (!cosmeticId) return;
    const cosmetic = items[cosmeticId];
    if (cosmetic) {
      cosmetic.backpack = item;
    }
  });

  const daily = ShopHelper.createStorefront("BRDailyStorefront");
  const weekly = ShopHelper.createStorefront("BRWeeklyStorefront");
  const battlepass = ShopHelper.createBattlePassStorefront(shop, `BRSeason${config.currentSeason}`);

  try {
    const BRSeasonJSON = await fs.readFile(
      path.join(__dirname, "..", "memory", "storefront", `BRSeason${config.currentSeason}.json`),
      'utf8'
    ).then(JSON.parse);

    BRSeasonJSON.catalogEntries.forEach((entryData) => {
      let battlepassOffer = createBattlePassEntryTemplate();
      battlepassOffer = entryData;
      battlepass.catalogEntries.push(battlepassOffer);
    });
  } catch (error) {
    logger.error(`Failed to push battlepass data: ${error}`);
    throw error;
  }

  while (daily.catalogEntries.length < 6) {
    const keys = Object.keys(items);
    let characters = 0;

    if (keys.length === 0) continue;

    let randomKey;
    let randomItem;

    do {
      randomKey = keys[Math.floor(Math.random() * keys.length)];
      randomItem = items[randomKey];
    } while (
      randomItem.type.backendValue === "AthenaBackpack" ||
      randomItem.type.backendValue === "AthenaSkyDiveContrail" ||
      randomItem.type.backendValue === "AthenaMusicPack" ||
      randomItem.type.backendValue === "AthenaToy"
    );

    if (randomItem.type.backendValue === "AthenaCharacter") {
      if (characters < 2) characters++;
      else continue;
    }

    const entry = createItemEntryTemplate();
    entry.offerId = `:/${uuid()}`;
    entry.offerType = "StaticPrice";
    entry.metaInfo.push({ key: "TileSize", value: "Small" });
    entry.metaInfo.push({ key: "SectionId", value: "Daily" });
    entry.meta.SectionId = "Daily";
    entry.meta.TileSize = "Small";

    entry.requirements.push({
      requirementType: "DenyOnItemOwnership",
      requiredId: `${randomItem.type.backendValue}:${randomItem.id}`,
      minQuantity: 1,
    });

    entry.refundable = true;
    entry.giftInfo.bIsEnabled = true;
    entry.giftInfo.forcedGiftBoxTemplateId = "";
    entry.giftInfo.purchaseRequirements = entry.requirements;
    entry.giftInfo.giftRecordIds = [];

    const price = getPrice(randomItem);
    if (!price) continue;

    entry.prices.push({
      currencySubType: "Currency",
      currencyType: "MtxCurrency",
      dynamicRegularPrice: -1,
      saleExpiration: "9999-12-31T23:59:59.999Z",
      basePrice: price,
      regularPrice: price,
      finalPrice: price,
    });

    entry.devName = `[VIRTUAL] 1x ${randomItem.type.backendValue}:${randomItem.id} for ${price} MtxCurrency`;

    entry.itemGrants.push({
      templateId: `${randomItem.type.backendValue}:${randomItem.id}`,
      quantity: 1,
    });

    if (randomItem.backpack) {
      entry.itemGrants.push({
        templateId: `${randomItem.backpack.type.backendValue}:${randomItem.backpack.id}`,
        quantity: 1,
      });

      entry.requirements.push({
        requirementType: "DenyOnItemOwnership",
        requiredId: `${randomItem.backpack.type.backendValue}:${randomItem.backpack.id}`,
        minQuantity: 1,
      });
    }

    daily.catalogEntries.push(entry);

    if (characters === 2) break;
  }

  let minimumWeeklyItems = config.currentSeason >= 9 ? 5 : config.currentSeason >= 1 ? 3 : 2;

  while (getRandomFullSetLength(weekly.catalogEntries) < minimumWeeklyItems) {
    const keys = Object.keys(sets);
    if (keys.length === 0) continue;

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomSet = sets[randomKey];

    for (const item of randomSet.definition) {
      const entry = createItemEntryTemplate();
      entry.offerId = `v2:/${uuid()}`;
      entry.offerType = "StaticPrice";

      if (!item.displayAssetPath) item.displayAssetPath = setDisplayAsset(`DA_Daily_${item.id}`);
      else if (!item.NewDisplayAssetPath) item.NewDisplayAssetPath = "";

      entry.displayAssetPath = item.displayAssetPath.includes("DA_Daily")
        ? item.displayAssetPath
        : setDisplayAsset(`DA_Daily_${item.id}`);
      entry.NewDisplayAssetPath = item.NewDisplayAssetPath;

      entry.metaInfo.push({ key: "DisplayAssetPath", value: entry.displayAssetPath });
      entry.metaInfo.push({ key: "NewDisplayAssetPath", value: entry.NewDisplayAssetPath });
      entry.metaInfo.push({ key: "TileSize", value: "Normal" });
      entry.metaInfo.push({ key: "SectionId", value: "Featured" });

      entry.meta.NewDisplayAssetPath = entry.NewDisplayAssetPath;
      entry.meta.displayAssetPath = entry.displayAssetPath;
      entry.meta.SectionId = "Featured";
      entry.meta.TileSize = "Normal";

      entry.requirements.push({
        requirementType: "DenyOnItemOwnership",
        requiredId: `${item.type.backendValue}:${item.id}`,
        minQuantity: 1,
      });

      entry.refundable = true;
      entry.giftInfo.bIsEnabled = true;
      entry.giftInfo.forcedGiftBoxTemplateId = "";
      entry.giftInfo.purchaseRequirements = entry.requirements;
      entry.giftInfo.giftRecordIds = [];

      entry.categories.push(item.set.backendValue);

      const price = getPrice(item);
      if (!price) continue;

      entry.prices.push({
        currencySubType: "Currency",
        currencyType: "MtxCurrency",
        dynamicRegularPrice: -1,
        saleExpiration: "9999-12-31T23:59:59.999Z",
        basePrice: price,
        regularPrice: price,
        finalPrice: price,
      });

      entry.devName = `[VIRTUAL] 1x ${item.type.backendValue}:${item.id} for ${price} MtxCurrency`;

      entry.itemGrants.push({
        templateId: `${item.type.backendValue}:${item.id}`,
        quantity: 1,
      });

      if (item.backpack) {
        entry.itemGrants.push({
          templateId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
          quantity: 1,
        });

        entry.requirements.push({
          requirementType: "DenyOnItemOwnership",
          requiredId: `${item.backpack.type.backendValue}:${item.backpack.id}`,
          minQuantity: 1,
        });
      }

      weekly.catalogEntries.push(entry);
    }
  }

  ShopHelper.push(shop, daily);
  ShopHelper.push(shop, weekly);
  ShopHelper.push(shop, battlepass);
}

module.exports = { generate };

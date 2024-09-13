
const StorefrontNames = ["BRWeeklyStorefront", "BRDailyStorefront"];

const CurrencyType = ["RealMoney", "MtxCurrency"];

class Set {
  constructor(value, text, definition) {
    this.value = value;
    this.text = text;
    this.definition = definition; 
  }
}

class Shop {
  constructor(expiration, refreshIntervalHrs, dailyPurchaseHrs, storefronts) {
    this.expiration = expiration;
    this.refreshIntervalHrs = refreshIntervalHrs;
    this.dailyPurchaseHrs = dailyPurchaseHrs;
    this.storefronts = storefronts; 
  }
}

class Storefronts {
  constructor(name, catalogEntries) {
    this.name = name;
    this.catalogEntries = catalogEntries; 
  }
}

class BattlePassStorefront {
  constructor(name, catalogEntries) {
    this.name = name;
    this.catalogEntries = catalogEntries;
  }
}

class Entries {
  constructor(
    offerId, offerType, devName, itemGrants, requirements, categories,
    metaInfo, meta, giftInfo, prices, bannerOverride, displayAssetPath,
    NewDisplayAssetPath, refundable, title, description, shortDescription,
    appStoreId, fulfillmentIds, dailyLimit, weeklyLimit, monthlyLimit,
    sortPriority, catalogGroupPriority, filterWeight
  ) {
    this.offerId = offerId;
    this.offerType = offerType;
    this.devName = devName;
    this.itemGrants = itemGrants; 
    this.requirements = requirements;
    this.categories = categories;
    this.metaInfo = metaInfo; 
    this.meta = meta;
    this.giftInfo = giftInfo;
    this.prices = prices;
    this.bannerOverride = bannerOverride;
    this.displayAssetPath = displayAssetPath;
    this.NewDisplayAssetPath = NewDisplayAssetPath;
    this.refundable = refundable;
    this.title = title;
    this.description = description;
    this.shortDescription = shortDescription;
    this.appStoreId = appStoreId;
    this.fulfillmentIds = fulfillmentIds;
    this.dailyLimit = dailyLimit;
    this.weeklyLimit = weeklyLimit;
    this.monthlyLimit = monthlyLimit;
    this.sortPriority = sortPriority;
    this.catalogGroupPriority = catalogGroupPriority;
    this.filterWeight = filterWeight;
  }
}

class BattlePassEntry {
  constructor(
    offerId, devName, offerType, prices, categories, dailyLimit, weeklyLimit,
    monthlyLimit, appStoreId, requirements, metaInfo, catalogGroup,
    catalogGroupPriority, sortPriority, title, shortDescription, description,
    displayAssetPath, itemGrants
  ) {
    this.offerId = offerId;
    this.devName = devName;
    this.offerType = offerType;
    this.prices = prices;
    this.categories = categories;
    this.dailyLimit = dailyLimit;
    this.weeklyLimit = weeklyLimit;
    this.monthlyLimit = monthlyLimit;
    this.appStoreId = appStoreId;
    this.requirements = requirements;
    this.metaInfo = metaInfo; 
    this.catalogGroup = catalogGroup;
    this.catalogGroupPriority = catalogGroupPriority;
    this.sortPriority = sortPriority;
    this.title = title; 
    this.shortDescription = shortDescription;
    this.description = description; 
    this.displayAssetPath = displayAssetPath;
    this.itemGrants = itemGrants; 
  }
}

class Meta {
  constructor(
    NewDisplayAssetPath, LayoutId, TileSize, AnalyticOfferGroupId, SectionId,
    templateId, inDate, outDate, displayAssetPath
  ) {
    this.NewDisplayAssetPath = NewDisplayAssetPath;
    this.LayoutId = LayoutId;
    this.TileSize = TileSize;
    this.AnalyticOfferGroupId = AnalyticOfferGroupId;
    this.SectionId = SectionId;
    this.templateId = templateId;
    this.inDate = inDate;
    this.outDate = outDate;
    this.displayAssetPath = displayAssetPath;
  }
}

class ItemGrants {
  constructor(templateId, quantity) {
    this.templateId = templateId;
    this.quantity = quantity;
  }
}

class MetaInfo {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class GiftInfo {
  constructor(bIsEnabled, forcedGiftBoxTemplateId, purchaseRequirements, giftRecordIds) {
    this.bIsEnabled = bIsEnabled;
    this.forcedGiftBoxTemplateId = forcedGiftBoxTemplateId;
    this.purchaseRequirements = purchaseRequirements; 
    this.giftRecordIds = giftRecordIds;
  }
}

class Requirements {
  constructor(requirementType, requiredId, minQuantity) {
    this.requirementType = requirementType;
    this.requiredId = requiredId;
    this.minQuantity = minQuantity;
  }
}

class Prices {
  constructor(
    currencyType, currencySubType, regularPrice, dynamicRegularPrice, finalPrice,
    saleExpiration, basePrice
  ) {
    this.currencyType = currencyType;
    this.currencySubType = currencySubType;
    this.regularPrice = regularPrice;
    this.dynamicRegularPrice = dynamicRegularPrice;
    this.finalPrice = finalPrice;
    this.saleExpiration = saleExpiration;
    this.basePrice = basePrice;
  }
}

module.exports = {
  Set,
  Shop,
  Storefronts,
  BattlePassStorefront,
  Entries,
  BattlePassEntry,
  Meta,
  ItemGrants,
  MetaInfo,
  GiftInfo,
  Requirements,
  Prices
};

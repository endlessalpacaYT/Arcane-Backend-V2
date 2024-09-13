const { itemStorageService } = require("../..");
const { ShopHelper } = require("../helpers/shophelper");
const { ShopGenerator } = require("../shop");

async function updateStorefront() {
  await ShopGenerator.generate();

  const shopData = ShopHelper.getCurrentShop();
  const addedItems = await itemStorageService.addItems([{ data: shopData, type: "storefront" }]);

  if (!addedItems) return false;

  return true;
}

module.exports = updateStorefront;

const { v4: uuid } = require('uuid');
const { createBattlePassEntryTemplate } = require('./template');
const { ShopGenerator } = require('../shop');

const ShopHelper = {
  createStorefront: function(sectionName) {
    return {
      name: sectionName,
      catalogEntries: []
    };
  },

  push: function(shop, storefront) {
    shop.storefronts.push(storefront);
  },

  getCurrentShop: function() {
    return ShopGenerator.shop;
  },

  createBattlePassStorefront: function(shop, sectionName) {
    return {
      name: sectionName,
      catalogEntries: []
    };
  }
};

module.exports = { ShopHelper };

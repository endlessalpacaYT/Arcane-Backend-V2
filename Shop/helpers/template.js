function createBattlePassEntryTemplate() {
    return {
      offerId: "",
      devName: "",
      offerType: "",
      prices: [],
      categories: [],
      dailyLimit: -1,
      weeklyLimit: -1,
      monthlyLimit: -1,
      appStoreId: [],
      requirements: [],
      metaInfo: [],
      displayAssetPath: "",
      itemGrants: [],
      sortPriority: 1,
      catalogGroupPriority: 1,
      title: {},
      description: {},
      catalogGroup: "",
      shortDescription: "",
    };
  }
  
  function createItemEntryTemplate() {
    return {
      offerId: "",
      offerType: "",
      devName: "",
      itemGrants: [],
      requirements: [],
      categories: [],
      metaInfo: [],
      meta: {},
      giftInfo: {},
      prices: [],
      bannerOverride: "",
      displayAssetPath: "",
      NewDisplayAssetPath: "",
      refundable: false,
      title: "",
      description: "",
      shortDescription: "",
      appStoreId: [],
      fulfillmentIds: [],
      dailyLimit: -1,
      weeklyLimit: -1,
      monthlyLimit: -1,
      sortPriority: 0,
      catalogGroupPriority: 0,
      filterWeight: 0,
    };
  }
  
  function test() {
    return {};
  }
  
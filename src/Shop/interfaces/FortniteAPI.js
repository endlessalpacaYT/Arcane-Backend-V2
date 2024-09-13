
class JSONResponse {
    constructor(
      id, name, description, type, rarity, series, set, backpack, introduction,
      images, itemPreviewHeroPath, displayAssetPath, NewDisplayAssetPath, definitionPath,
      path, added, shopHistory
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.type = type; 
      this.rarity = rarity; 
      this.series = series; 
      this.set = set; 
      this.backpack = backpack; 
      this.introduction = introduction; 
      this.images = images; 
      this.itemPreviewHeroPath = itemPreviewHeroPath;
      this.displayAssetPath = displayAssetPath;
      this.NewDisplayAssetPath = NewDisplayAssetPath;
      this.definitionPath = definitionPath;
      this.path = path;
      this.added = added;
      this.shopHistory = shopHistory; 
    }
  }
  
  class CosmeticType {
    constructor(value, displayValue, backendValue) {
      this.value = value;
      this.displayValue = displayValue;
      this.backendValue = backendValue;
    }
  }
  
  class CosmeticRarity {
    constructor(value, displayValue, backendValue) {
      this.value = value;
      this.displayValue = displayValue;
      this.backendValue = backendValue;
    }
  }
  
  class CosmeticSeries {
    constructor(value, image, colors, backendValue) {
      this.value = value;
      this.image = image;
      this.colors = colors;
      this.backendValue = backendValue;
    }
  }
  
  class CosmeticSet {
    constructor(value, text, backendValue) {
      this.value = value;
      this.text = text;
      this.backendValue = backendValue;
    }
  }
  
  class CosmeticIntroduction {
    constructor(chapter, season, text, backendValue) {
      this.chapter = chapter;
      this.season = season;
      this.text = text;
      this.backendValue = backendValue;
    }
  }
  
  class CosmeticImages {
    constructor(smallIcon, icon, featured, lego, other) {
      this.smallIcon = smallIcon;
      this.icon = icon;
      this.featured = featured;
      this.lego = lego;
      this.other = other;
    }
  }
  
  module.exports = {
    JSONResponse,
    CosmeticType,
    CosmeticRarity,
    CosmeticSeries,
    CosmeticSet,
    CosmeticIntroduction,
    CosmeticImages
  };
  
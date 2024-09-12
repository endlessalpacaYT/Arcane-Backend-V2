export function getPrice(item) {
    const rarity = item.rarity.backendValue.split("::")[1];
  
    switch (item.type.backendValue) {
      case "AthenaCharacter":
        var prices = [800, 1200, 1500, 2000];
  
        switch (rarity) {
          case "Uncommon":
            return prices[0];
  
          case "Rare":
            return prices[1];
  
          case "Epic":
            return prices[2];
  
          case "Legendary":
            return prices[3];
        }
        break;
  
      case "AthenaPickaxe":
        prices = [500, 800, 1200];
  
        switch (rarity) {
          case "Uncommon":
            return prices[0];
  
          case "Rare":
            return prices[1];
  
          case "Epic":
            return prices[2];
        }
        break;
  
      case "AthenaGlider":
        prices = [500, 800, 1200, 1500];
  
        switch (rarity) {
          case "Uncommon":
            return prices[0];
  
          case "Rare":
            return prices[1];
  
          case "Epic":
            return prices[2];
  
          case "Legendary":
            return prices[3];
        }
        break;
  
      case "AthenaItemWrap":
        prices = [300, 500];
  
        switch (rarity) {
          case "Uncommon":
            return prices[0];
  
          case "Rare":
            return prices[1];
  
          case "Epic":
            return prices[1];
        }
        break;
  
      case "AthenaDance":
        prices = [200, 500, 800];
  
        switch (rarity) {
          case "Uncommon":
            return prices[0];
  
          case "Rare":
            return prices[1];
  
          case "Epic":
            return prices[2];
        }
        break;
    }
  }
  
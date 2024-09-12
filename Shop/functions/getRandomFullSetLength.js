const { Entries } = require("../interfaces/Dedarations");

function getRandomFullSetLength(entries) {
    const uniqueCategories = new Set();
  
    const offer = entries.reduce((map, groups) => {
      if (!groups.categories || groups.categories.length === 0) return map;
  
      const category = groups.categories[0];
  
      uniqueCategories.add(category);
  
      if (!map.has(category)) map.set(category, []);
  
      map.get(category).push(groups);
  
      return map;
    }, new Map());
  
    return uniqueCategories.size;
  }
  
  export default getRandomFullSetLength;
  
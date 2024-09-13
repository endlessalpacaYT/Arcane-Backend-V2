function getBaseItemId(fullItemId) {
    const prefixesToRemove = [
      "AthenaCharacter",
      "AthenaGlider",
      "AthenaPickaxe",
      "AthenaItemWrap",
      "AthenaDance",
    ];
  
    for (const prefix of prefixesToRemove) {
      if (fullItemId.includes(prefix)) {
        return fullItemId.replace(`${prefix}:`, "");
      }
    }
  
    return fullItemId;
  }
  
  function setDisplayAsset(item) {
    const baseItemId = getBaseItemId(item);
    return `/Game/Catalog/DisplayAssets/${baseItemId}.${baseItemId}`;
  }
  
  function setNewDisplayAssetPath(item) {
    const baseItemId = getBaseItemId(item);
    const newDisplayAsset = `DAv2_Featured_${baseItemId}`;
    return `/Game/Catalog/NewDisplayAssets/${newDisplayAsset}.${newDisplayAsset}`;
  }
  
  function getDisplayAsset(item) {
    const baseItemId = getBaseItemId(item);
    return `/Game/Catalog/DisplayAssets/${baseItemId}.${baseItemId}`;
  }
  
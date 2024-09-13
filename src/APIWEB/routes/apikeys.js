const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

const apiKeysFilePath = path.join(__dirname, 'apiKeys.json');

const generateApiKey = () => {
    const apiKey = uuidv4();
    
    let apiKeys = [];
    if (fs.existsSync(apiKeysFilePath)) {
        const apiKeysData = fs.readFileSync(apiKeysFilePath);
        apiKeys = JSON.parse(apiKeysData);
    }

    apiKeys.push({ apiKey, createdAt: new Date().toISOString() });

    fs.writeFileSync(apiKeysFilePath, JSON.stringify(apiKeys, null, 2));

    return apiKey;
};

const getApiKeys = () => {
    if (fs.existsSync(apiKeysFilePath)) {
        const apiKeysData = fs.readFileSync(apiKeysFilePath);
        return JSON.parse(apiKeysData);
    }
    return [];
};

module.exports = {
    generateApiKey,
    getApiKeys
};

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const apiKeysFilePath = path.resolve(__dirname, 'apiKeys.json');

const generateApiKey = () => {
    const apiKey = uuidv4();
    let apiKeys = [];
    try {
        if (fs.existsSync(apiKeysFilePath)) {
            const apiKeysData = fs.readFileSync(apiKeysFilePath);
            apiKeys = JSON.parse(apiKeysData);
        }
    } catch (error) {
        console.error('Error reading or parsing apiKeys.json:', error);
        fs.writeFileSync(apiKeysFilePath, JSON.stringify([], null, 2));
    }
    apiKeys.push({ apiKey, createdAt: new Date().toISOString() });
    fs.writeFileSync(apiKeysFilePath, JSON.stringify(apiKeys, null, 2));
    return apiKey;
};

const getApiKeys = () => {
    try {
        if (fs.existsSync(apiKeysFilePath)) {
            const apiKeysData = fs.readFileSync(apiKeysFilePath);
            return JSON.parse(apiKeysData);
        }
    } catch (error) {
        console.error('Error reading or parsing apiKeys.json:', error);
    }
    return [];
};

module.exports = {
    generateApiKey,
    getApiKeys
};

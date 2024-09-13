const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { generateApiKey, getApiKeys } = require('./apikeys'); 

const versionInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../version.json')));

router.get('/currentversion', (req, res) => {
    res.json({
        version: versionInfo.version,
        versionDate: versionInfo.releaseDate,
        backend: versionInfo.backend,
        path: `/api/update/${versionInfo.version}`
    });
});

router.post('/generateApiKey', (req, res) => {
    const newApiKey = generateApiKey();
    res.json({ message: 'API key generated successfully!', apiKey: newApiKey });
});

router.get('/apiKeys', (req, res) => {
    const apiKeys = getApiKeys();
    res.json(apiKeys);
});

module.exports = router; 

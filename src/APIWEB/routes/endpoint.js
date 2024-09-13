const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { generateApiKey, getApiKeys } = require('./apikeys'); 

const versionInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../version.json')));

router.get('/currentversion', (req, res, next) => {
    try {
        res.json({
            version: versionInfo.version,
            versionDate: versionInfo.releaseDate,
            backend: versionInfo.backend,
            path: `/api/update/${versionInfo.version}`
        });
    } catch (err) {
        next(err);
    }
});

router.post('/generateApiKey', (req, res, next) => {
    try {
        const newApiKey = generateApiKey();
        res.json({ message: 'API key generated successfully!', apiKey: newApiKey });
    } catch (err) {
        next(err);
    }
});

router.get('/apiKeys', (req, res, next) => {
    try {
        const apiKeys = getApiKeys();
        res.json(apiKeys);
    } catch (err) {
        next(err);
    }
});

module.exports = router;

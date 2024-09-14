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

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        code: 'errors.com.arcanev2.internal.server.error',
        message: 'An unexpected error occurred.',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});

router.use((req, res) => {
    const errorResponse = {
        code: 'errors.com.arcanev2.endpoint.not.found.error',
        message: 'The requested endpoint was not found.',
        url: req.originalUrl,
        method: req.method
    };
    res.status(404).json(errorResponse);
});

module.exports = router; 

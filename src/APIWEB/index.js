const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const { generateApiKey, getApiKeys } = require('./routes/apikeys'); 

dotenv.config();

const app = express();
<<<<<<< HEAD
const ip = process.env.IPV1 || '127.0.0.1';
const port = process.env.PORTV1 || 5555;
=======
const ip = process.env.IP || '127.0.0.1';
const port = process.env.API_WEBSERVICE_PORT || 5555;
>>>>>>> a3416b002cb3ccf711f55bcd0cb9c92b5f39df37

const version = process.env.VERSIONV2 || "0.0.1.0";
const backend = process.env.BACKENDV2 || "ArcaneV2";
const latestVersion = version;
const namebackend = backend;
const updatesDirectory = path.join(__dirname, 'updates');

app.use(helmet()); 
app.use(compression()); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,  
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.get("/api/currentversion", (req, res) => {
    res.send({
        version: latestVersion,
        versionDate: '05/09/2024',
        backend: namebackend,
        path: `/api/update/${latestVersion}`
    });
});

app.post('/generateApiKey', (req, res) => {
    const newApiKey = generateApiKey();
    res.json({ message: 'API key generated successfully!', apiKey: newApiKey });
});

app.get('/apiKeys', (req, res) => {
    const apiKeys = getApiKeys();
    res.json(apiKeys);
});

const apiRoutes = require('./routes/endpoint'); 
if (typeof apiRoutes !== 'function' && typeof apiRoutes.router !== 'object') {
    throw new TypeError('apiRoutes should be an Express router or middleware function');
}
app.use('/api', apiRoutes); 

app.use((req, res, next) => {
    const errorResponse = {
        code: 'errors.com.arcanev2.endpoint.not.found.error',
        message: 'The requested endpoint was not found.',
        url: req.originalUrl,
        method: req.method
    };
    res.status(404).json(errorResponse);
});

app.listen(port, ip, () => {
    console.info(`Arcane APIWebService ${ip}:${port}`);
});

module.exports = app;

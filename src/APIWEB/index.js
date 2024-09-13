const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const ip = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 5555;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

app.use(helmet()); 
app.use(compression()); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,  
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

const apiRoutes = require('./routes/endpoint'); 
if (typeof apiRoutes !== 'function' && typeof apiRoutes.router !== 'object') {
    throw new TypeError('apiRoutes should be an Express router or middleware function');
}
app.use('/api', apiRoutes); 

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, ip, () => {
    logger.info(`The API is running on ${ip}:${port}`);
    console.log(`[${new Date().toISOString()}] The API is running on ${ip}:${port}`);
});

module.exports = app;

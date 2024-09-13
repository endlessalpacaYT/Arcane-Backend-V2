const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3551;

const functions = require("./src/utils/functions.js");
const err = require("./src/utils/error.js");
const shop = require("./src/Shop/shop.js");
const friends = require("./src/routes/friends.js");
const authRoutes = require('./src/routes/auth');
const cloudstorage = require('./src/routes/cloudstorage.js');
const mcp = require("./src/routes/mcp.js");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(express.json());

app.use(authRoutes);
app.use(cloudstorage);
app.use(mcp);
app.use(friends);

app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            console.error(`Issue with request: ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
});

app.use((req, res) => {
    res.status(404).json({
        error: "errors.common.arcane.notfound",
        status: 404
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something went wrong!",
        details: `500, Server Error: ${err.message}`,
        status: 500
    });
});

async function initDB() {
    const mongoDB = process.env.MONGODB || "mongodb://127.0.0.1:27017/Arcane";
    try {
        await mongoose.connect(mongoDB);
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        console.log("Closing in 5 seconds...");
        setTimeout(() => process.exit(1), 5000); 
    }
}

async function startHTTPServer() {
    app.listen(PORT, () => {
        console.log(`Arcane Backend Listening on 127.0.0.1:${PORT}`);
    });
}

async function startMain() {
    await initDB();  
    await startHTTPServer();
    require("./src/discord/index.js");  
}

function startBackend() {
    console.log("Arcane Starting...");
    startMain();
}

function handleShutdown(signal) {
    console.log(`Received ${signal}. Closing server...`);
    app.close(() => {
        console.log('Server closed.');
        mongoose.disconnect(() => {
            console.log('MongoDB disconnected.');
            process.exit(0);
        });
    });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startBackend();

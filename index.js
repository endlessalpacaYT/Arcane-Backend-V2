const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');
const path = require('path');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3551;

const startTime = new Date();

const functions = require("./src/utils/functions.js");
const err = require("./src/utils/error.js");
const friends = require("./src/routes/friends.js");
const authRoutes = require('./src/routes/auth');
const cloudstorage = require('./src/routes/cloudstorage.js');
const lightswitch = require('./src/routes/lightswitch.js');
const profile = require("./src/routes/profile.js");
const party = require("./src/routes/party.js");
const mcp = require("./src/routes/mcp.js");
const matchmaker = require("./src/routes/matchmaker.js");
const timeline = require("./src/routes/timeline.js");
const contentpages = require("./src/Responses/contentpages.js");
const athena = require("./src/Responses/athena.js");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Requested [${req.method} ${req.url}]`);

    const originalSend = res.send;
    res.send = function (body) {
        console.log(`[${new Date().toISOString()}] Response [${req.method} ${req.url}]: ${body}`);
        originalSend.apply(res, arguments);
    };

    next();
});

app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            console.error(`Issue with request: ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
});

app.use(lightswitch);
app.use(authRoutes);
app.use(profile);
app.use(party);
app.use(cloudstorage);
app.use(mcp);
app.use(matchmaker);
app.use(timeline);
app.use(friends);
app.use(athena);
app.use(contentpages)

app.get('/api/runtime', (req, res) => {
    const now = new Date();
    const uptimeMs = now - startTime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);

    res.json({
        uptime: {
            hours: uptimeHours,
            minutes: uptimeMinutes % 60,
            seconds: uptimeSeconds % 60
        }
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
    const mongoDB = process.env.MONGODB || "mongodb://127.0.0.1/Arcane";
    try {
        await mongoose.connect(mongoDB);
        console.log("MongoDB connected successfully to: " + mongoDB);
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
    require("./src/api/index.js");
    require("./src/xmpp/xmpp.js"); 
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

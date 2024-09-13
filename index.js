const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3551;

const functions = require("./utils/functions.js");
const err = require("./utils/error.js");
const shop = require("./Shop/shop.js");
const friends = require("./routes/friends.js");
const authRoutes = require('./routes/auth');
const cloudstorage = require('./routes/cloudstorage.js');
const mcp = require("./routes/mcp.js");

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

// Initialize MongoDB connection
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
    require("./discord/index.js");  
}

function startBackend() {
    console.log("Arcane Starting...");
    startMain();
}

startBackend();

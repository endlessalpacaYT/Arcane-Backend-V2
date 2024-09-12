const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3551

const functions = require("./structs/functions.js");

const authRoutes = require('./routes/auth');
app.use(authRoutes);

app.use((req, res, next) => {
    const originalSend = res.send;
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            console.error(`Issue with request: ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
});

app.use(require("./structs/error.js"));

function startMain() {
    function initDB() {
        const mongoDB = process.env.MONGODB;
        mongoose.connect(mongoDB || "mongodb://127.0.0.1:27017/Arcane")
        .then(() => {
            console.log("MongoDB connected successfully!");
            function startHTTPServer() {
                app.listen(PORT, () => {
                    console.log(`Arcane Backend Listening On 127.0.0.1:${PORT}`);
                });
            }
            startHTTPServer();
            require("./discord/index.js")
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
            console.log("Closing In 5 Seconds...");
            functions.timeout(5000);
            process.exit(1); 
        });
    }

    initDB();
}

function startBackend() {
    console.log("Arcane Starting");
    startMain();
};

startBackend();
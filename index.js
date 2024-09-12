const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3551

const functions = require("./structs/functions.js");

app.use(express.json());

app.use((req, res, next) => {
    res.status(404);
    res.json({
        error: "errors.common.arcane.notfound",
        status: 404
    })
});

function startMain() {
    function initDB() {
        mongoose.connect("mongodb://127.0.0.1:27017/Arcane")
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
    console.log("Backend Starting");
    startMain();
};

startBackend();
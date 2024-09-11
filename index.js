const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3551

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
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
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
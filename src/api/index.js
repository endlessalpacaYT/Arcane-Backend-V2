const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.API_PORT || 5555

async function startHTTPServer() {
    app.listen(PORT, () => {
        console.log(`Arcane API Listening on 127.0.0.1:${PORT}`);
    });
}

async function startMain() {
    startHTTPServer();
}

startMain();
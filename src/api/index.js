const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.API_PORT || 5555

app.get('/', (req, res) => {
    res.json({
        api: "Arcane_API",
        version: "v0.1",
        started: Date.now()
    })
});

async function startHTTPServer() {
    app.listen(PORT, () => {
        console.log(`Arcane API Listening on 127.0.0.1:${PORT}`);
    });
}

async function startMain() {
    startHTTPServer();
}

startMain();
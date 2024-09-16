const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.API_PORT || 5555

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get('/', (req, res) => {
    res.json({
        api: "Arcane_API",
        version: "v1",
        started: Date.now()
    })
});

app.get('/backend', (req, res) => {
    res.json({
        backend: "ArcaneBackendV2",
        version: "v0.21",
        started: Date.now()
    })
})

app.get('/backend/timeline', (req, res) => {
    const seasonStart = process.env.API_SEASON_START;
    const seasonEnd = process.env.API_SEASON_END;

    res.json({
        seasonStart: seasonStart,
        seasonEnd: seasonEnd
    })
})

async function startHTTPServer() {
    app.listen(PORT, () => {
        console.log(`Arcane API Listening on 127.0.0.1:${PORT}`);
    });
}

async function startMain() {
    startHTTPServer();
}

startMain();
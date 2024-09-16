const express = require("express");

const app = express();

const functions = require("../utils/functions.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function generateServerTime() {
    return new Date().toISOString();
}

app.post('/datarouter/api/v1/public/data', (req, res) => {
    console.log('Data collection endpoint hit');
    res.status(204).end();
});

app.get("/fortnite/api/game/v2/versioncheck/:platform", (req, res) => {
    res.json({
        "forceClose": false,
        "version": "1.0.0",
        "lastUpdated": new Date().toISOString()
    });
});

app.get("/fortnite/api/playlists", (req, res) => {
    res.json({
        "playlists": [
            {
                "playlist_name": "Playlist_DefaultSolo",
                "playlist_id": "solo",
                "description": "Solo mode",
                "enabled": true
            },
            {
                "playlist_name": "Playlist_DefaultDuo",
                "playlist_id": "duo",
                "description": "Duo mode",
                "enabled": false
            },
            {
                "playlist_name": "Playlist_DefaultSquad",
                "playlist_id": "squad",
                "description": "Squad mode",
                "enabled": false
            }
        ]
    });
});

module.exports = app;

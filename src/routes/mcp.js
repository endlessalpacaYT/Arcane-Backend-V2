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
                "enabled": true
            },
            {
                "playlist_name": "Playlist_DefaultSquad",
                "playlist_id": "squad",
                "description": "Squad mode",
                "enabled": true
            }
        ]
    });
});

app.get("/fortnite/api/game/v2/events/tournament/:tournamentId", (req, res) => {
    const tournamentId = req.params.tournamentId;

    const response = {
        "events": [
            {
                "eventId": tournamentId,
                "eventType": "Tournament",
                "displayName": "Arcane Placeholder Tournament",
                "metadata": {
                    "banner_color": "blue",
                    "banner_icon": "tournamenticon",
                    "schedule_info": "Qualifiers Round 1",
                    "platforms": ["Windows", "PlayStation", "Xbox"]
                },
                "eventDates": [
                    {
                        "startDate": "2024-01-01T00:00:00.000Z",
                        "endDate": "2024-01-01T02:00:00.000Z"
                    }
                ],
                "eventWindows": [
                    {
                        "windowId": "Arcane-Window1",
                        "startTime": "2024-01-01T00:00:00.000Z",
                        "endTime": "2024-01-01T02:00:00.000Z",
                        "matchesPlayed": 0,
                        "teams": [
                            {
                                "teamId": "Backend-S12",
                                "teamName": "Backend-S12",
                                "players": ["pongo", "optix"]
                            },
                            {
                                "teamId": "ArcaneV2",
                                "teamName": "ArcaneV2",
                                "players": ["pongo", "optix", "mxrc3l", "coregamer32", "tgnick"]
                            }
                        ]
                    }
                ]
            },
            {
                "eventId": "FNCS_Tournament_1",
                "eventType": "Tournament",
                "displayName": "FNCS Qualifier 1",
                "metadata": {
                    "banner_color": "purple",
                    "banner_icon": "fncsicon",
                    "schedule_info": "Qualifier Round 1",
                    "platforms": ["Windows", "PlayStation", "Xbox"]
                },
                "eventDates": [
                    {
                        "startDate": "2024-02-01T00:00:00.000Z",
                        "endDate": "2024-02-01T02:00:00.000Z"
                    }
                ],
                "eventWindows": [
                    {
                        "windowId": "FNCS-Window1",
                        "startTime": "2024-02-01T00:00:00.000Z",
                        "endTime": "2024-02-01T02:00:00.000Z",
                        "matchesPlayed": 0,
                        "teams": [
                            {
                                "teamId": "team2",
                                "teamName": "Champions",
                                "players": ["player3", "player4"]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    res.json(response);
});

module.exports = app;

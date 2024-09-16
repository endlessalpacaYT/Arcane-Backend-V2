const express = require("express");

const app = express();

app.get('/content/api/pages/fortnite-game', (req, res) => {
    const currentDate = new Date().toISOString();

    res.json({
        "athenamessage": {
            "_title": "Battle Royale",
            "overrideablemessage": {
                "_type": "CommonUI Simple Message",
                "message": {
                    "_type": "CommonUI Simple Message Base",
                    "title": "Welcome To Fortnite",
                    "body": "Jump into the action in the new season. The island has changed, and there's more to explore!"
                }
            },
            "_activeDate": currentDate,
            "lastModified": currentDate,
            "_locale": "en-US"
        },
        "survivalmessage": {
            "_title": "Save the World",
            "overrideablemessage": {
                "_type": "CommonUI Simple Message",
                "message": {
                    "_type": "CommonUI Simple Message Base",
                    "title": "Survive the Storm",
                    "body": "Team up and take on the storm in this co-op adventure!"
                }
            },
            "_activeDate": currentDate,
            "lastModified": currentDate,
            "_locale": "en-US"
        },
        "playlistinformation": {
            "_title": "Playlist Information",
            "playlists": [
                {
                    "image": "https://cdn2.unrealengine.com/Fortnite/fortnite-game/playlistinformation/v94/11BR_Launch_Upsell_WhatsInside.png",
                    "playlist_name": "Season Playlist",
                    "_type": "FortPlaylistInfo",
                    "description": "Dive into Fortnite with new maps, modes, and more."
                }
            ]
        },
        "battlepassaboutmessages": {
            "_title": "Battle Pass",
            "news": {
                "_type": "Battle Royale News",
                "messages": [
                    {
                        "image": "https://cdn2.unrealengine.com/Fortnite/fortnite-game/battle-pass-about/Season_8/11BR_Launch_Upsell_HowDoesItWork.png",
                        "title": "How does it work?",
                        "body": "Level up your Battle Pass and unlock new rewards including V-Bucks!"
                    }
                ]
            }
        },
        "savetheworldnews": {
            "_title": "Save the World News",
            "news": {
                "messages": [
                    {
                        "image": "https://cdn2.unrealengine.com/Fortnite/fortnite-game/survival-news.png",
                        "title": "Save the World Update",
                        "body": "New challenges are available in Save the World mode."
                    }
                ]
            }
        }
    });
});

module.exports = app;
const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.API_PORT || 4444;


function sendData(block) {
    return async function (req, res) {
        try {
            const result = await block(req, res);
            if (!res.headersSent) {
                res.send(result);
            }
        } catch (error) {
            log.error(error);
            if (!res.headersSent) {
                res.status(500).send("Internal Server Error");
            }
        }
    };
}

app.get('/', (req, res) => {
    res.json({
        api: "Lightning_API",
        version: "v0.1",
        started: Date.now()
    })
});

app.get('/launcher/version', (req, res) => {
    const { branch } = req.query;

    if (branch == "beta") {
        res.json({
            version: process.env.BETA_LAUNCHER_VERSION,

        })
    } else {
        if (branch == "stable") {
            res.json({
                version: process.env.STABLE_LAUNCHER_VERSION,

            })
        }
    }
});

app.get('/installer', (req, res) => {
    const { branch } = req.query;

    if (branch == "beta") {
        res.json({
            url: "http://149.102.130.255:5000/beta/Beta-Installer.exe"

        })
    } else {
        if (branch == "stable") {
            res.json({
                url: "http://149.102.130.255:5000/stable/Lightning-Installer.exe"

            })
        }
    }
});

app.get('/launcher/download', (req, res) => {
    const { branch } = req.query;

    if (branch == "beta") {
        res.json({
            url: "http://149.102.130.255:5000/beta/latest.zip"

        })
    } else {
        if (branch == "stable") {
            res.json({
                url: "http://149.102.130.255:5000/stable/latest.zip"

            })
        }
    }
});

app.get('/backend/timeline', (req, res) => {
    const seasonStart = process.env.API_SEASON_START;
    const seasonEnd = process.env.API_SEASON_END;

    res.json({
        seasonStart: seasonStart,
        seasonEnd: seasonEnd
    })
})


app.get("/launcher/skin", sendData(async (req, res) => {
    const { account } = req.query;

    if (!account) {
        return res.status(400).send("Account ID is required.");
    }

    

    const profile = await Profiles.findOne({ account });

    if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
    }

    const playercid = profile.profiles.athena.items.Lightning.attributes.locker_slots_data.slots.Character.items;

    let cid;
    if (!playercid || playercid.length === 0) {
        cid = "CID_001_Athena_Commando_F_Default";
    } else {
        cid = playercid[0].replace('AthenaCharacter:', '');
    }

    try {
        const response = await axios.get(`https://fortnite-api.com/v2/cosmetics/br/${cid}`);
        const iconUrl = response.data.data.images.icon;

        if (!iconUrl) {
            console.error("Icon was not found.");
            return res.status(404).json({ error: "Icon was not found." });
        }

        console.log(`Icon URL for ${user.username}: ${iconUrl}`);
        return res.json(iconUrl);
    } catch (error) {
        console.error(`Failed: ${error.message}`);
        return res.status(500).json({ error: "Failed to get Current Skin" });
    }
}));

async function startHTTPServer() {
    app.listen(PORT, () => {
        console.log(`Arcane API Listening on 127.0.0.1:${PORT}`);
    });
}

async function startMain() {
    startHTTPServer();
}

startMain();
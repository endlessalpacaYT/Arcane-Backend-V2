const express = require("express");
require("dotenv").config();
const UserV2 = require("../Models/user/userv2.js");

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




app.post('/launcher/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and Password are required.' });
        }

        const user = await UserV2.findOne({ Email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid Email.' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.json({ success: true, message: 'Login successful', username: user.username, discordId: user.discordId });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Password.' });
        }
    } catch (error) {
        if (verboseLogging == "true") {
            console.error('Error during login of a user:', error);
        }
        
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
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
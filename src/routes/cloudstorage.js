const Express = require("express");
const express = Express.Router();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const functions = require("../utils/functions.js");

express.use((req, res, next) => {
    if (req.originalUrl.toLowerCase().startsWith("/fortnite/api/cloudstorage/user/") && req.method == "PUT") {
        req.rawBody = "";
        req.setEncoding("latin1");

        req.on("data", (chunk) => req.rawBody += chunk);
        req.on("end", () => next());
    }
    else return next();
})

express.get('/fortnite/api/cloudstorage/system', (req, res) => {
    const response = [
        {
            "uniqueFilename": "DefaultGame.ini",
            "filename": "DefaultGame.ini",
            "hash": "DUMMY_HASH_FOR_DEFAULT_GAME",
            "length": 12345,
            "contentType": "application/octet-stream",
            "uploaded": "2024-01-01T00:00:00.000Z",
            "storageType": "S3"
        },
        {
            "uniqueFilename": "DefaultEngine.ini",
            "filename": "DefaultEngine.ini",
            "hash": "DUMMY_HASH_FOR_DEFAULT_ENGINE",
            "length": 12345,
            "contentType": "application/octet-stream",
            "uploaded": "2024-01-01T00:00:00.000Z",
            "storageType": "S3"
        },
        {
            "uniqueFilename": "DefaultInput.ini",
            "filename": "DefaultInput.ini",
            "hash": "DUMMY_HASH_FOR_DEFAULT_INPUT",
            "length": 12345,
            "contentType": "application/octet-stream",
            "uploaded": "2024-01-01T00:00:00.000Z",
            "storageType": "S3"
        }
    ];

    res.json(response);
});

express.get("/fortnite/api/cloudstorage/system/:file", async (req, res) => {
    const file = path.join(__dirname, "..", "CloudStorage", req.params.file);

    if (fs.existsSync(file)) {
        const ParsedFile = fs.readFileSync(file);

        try {
            return res.status(200).send(ParsedFile);
        }catch (err) {
            console.log("An Error Occured When Sending Data Through CloudStorage: " + err);
        }
    } else {
        res.status(200);
    }
})

express.get("/fortnite/api/cloudstorage/user/*/:file", async (req, res) => {
    try {
        const clientSettingsDir = path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings");
        if (!fs.existsSync(clientSettingsDir)) {
            fs.mkdirSync(clientSettingsDir, { recursive: true });  
        }
    } catch (err) {
        console.error("Error creating directory:", err);
    }

    res.set("Content-Type", "application/octet-stream");

    if (req.params.file.toLowerCase() !== "clientsettings.sav") {
        return res.status(404).json({
            "error": "File not found"
        });
    }

    const memory = functions.GetVersionInfo(req);
    const currentBuildID = memory.CL;

    let filePath;
    if (process.env.LOCALAPPDATA) {
        filePath = path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings", `ClientSettings-${currentBuildID}.Sav`);
    } else {
        filePath = path.join(__dirname, "..", "ClientSettings", `ClientSettings-${currentBuildID}.Sav`);
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            try {
                return res.status(200);  
            }catch (err) {
                console.log("An Error Occured When Sending Data Through CloudStorage: " + err);
            }
        }

        return res.status(200).send(data); 
    });
});

express.get("/fortnite/api/cloudstorage/user/:accountId", async (req, res) => {
    try {
        if (!fs.existsSync(path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings"))) {
            fs.mkdirSync(path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings"));
        }
    } catch (err) {}

    res.set("Content-Type", "application/json")

    const memory = functions.GetVersionInfo(req);

    var currentBuildID = memory.CL;
    
    let file;
    if (process.env.LOCALAPPDATA) file = path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings", `ClientSettings-${currentBuildID}.Sav`);
    else file = path.join(__dirname, "..", "ClientSettings", `ClientSettings-${currentBuildID}.Sav`);

    if (fs.existsSync(file)) {
        const ParsedFile = fs.readFileSync(file, 'latin1');
        const ParsedStats = fs.statSync(file);

        return res.json([{
            "uniqueFilename": "ClientSettings.Sav",
            "filename": "ClientSettings.Sav",
            "hash": crypto.createHash('sha1').update(ParsedFile).digest('hex'),
            "hash256": crypto.createHash('sha256').update(ParsedFile).digest('hex'),
            "length": Buffer.byteLength(ParsedFile),
            "contentType": "application/octet-stream",
            "uploaded": ParsedStats.mtime,
            "storageType": "S3",
            "storageIds": {},
            "accountId": req.params.accountId,
            "doNotCache": true
        }]);
    } else {
        return res.json([]);
    }
})

express.put("/fortnite/api/cloudstorage/user/*/:file", async (req, res) => {
    try {
        if (!fs.existsSync(path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings"))) {
            fs.mkdirSync(path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings"));
        }
    } catch (err) {}

    if (req.params.file.toLowerCase() != "clientsettings.sav") {
        return res.status(404).json({
            "error": "file not found"
        });
    }

    const memory = functions.GetVersionInfo(req);

    var currentBuildID = memory.CL;

    let file;
    if (process.env.LOCALAPPDATA) file = path.join(process.env.LOCALAPPDATA, "arcane", "ClientSettings", `ClientSettings-${currentBuildID}.Sav`);
    else file = path.join(__dirname, "..", "ClientSettings", `ClientSettings-${currentBuildID}.Sav`);

    try {
        fs.writeFileSync(file, req.rawBody, 'latin1');
    }catch (err) {
        console.log("Error Writing CloudStorage File: " + err)
    }
    res.status(204);
})

module.exports = express;
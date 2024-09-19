const express = require("express");
const crypto = require("crypto");
const UserV2 = require("../Models/user/userv2");
require("dotenv").config();

const app = express();

let buildUniqueId = {};
let accountId;

const generateRandomID = () => {
    return crypto.randomBytes(16).toString("hex").toUpperCase();
};

const matchmaker = {
    matchmakerIP: process.env.MATCHMAKER_IP || "127.0.0.1",
    matchmakerPort: process.env.MATCHMAKER_PORT || "80"
};

app.get("/fortnite/api/matchmaking/session/findPlayer/*", (req, res) => {
    res.status(200).end();
});

app.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", async(req, res) => {
    if (typeof req.query.bucketId !== "string") return res.status(400).end();
    if (req.query.bucketId.split(":").length !== 4) return res.status(400).end();

    accountId = req.params.accountId;  
    const userV2 = await UserV2.findOne({ Account: accountId });

    buildUniqueId[accountId] = req.query.bucketId.split(":")[0];
    if (!userV2.MatchmakerBanned == true) {
    res.json({
        "serviceUrl": `ws://${matchmaker.matchmakerIP}:${matchmaker.matchmakerPort}`,
        "ticketType": "mms-player",
        "payload": userV2.MatchmakerID, 
        "signature": "420=" 
    });
    res.end();
} else {
    return res.status(401).json({
        "error": "arcane.errors.user.matchmaker.banned"
    });
}
});

app.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", (req, res) => {
    res.json({
        "accountId": req.params.accountId,
        "sessionId": req.params.sessionId,
        "key": "none"
    });
});

app.get("/fortnite/api/matchmaking/session/:sessionId", (req, res) => {
    const clientRegion = req.query.region || "EU"; 
    const gameServerInfo = {
        serverAddress: process.env.GS_IP || "127.0.0.1",
        serverPort: process.env.GS_PORT || 7777
    };

    res.json({
        "id": req.params.sessionId,
        "ownerId": generateRandomID(),
        "ownerName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        "serverName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        "serverAddress": gameServerInfo.serverAddress,
        "serverPort": gameServerInfo.serverPort,
        "maxPublicPlayers": 220,
        "openPublicPlayers": 175,
        "maxPrivatePlayers": 0,
        "openPrivatePlayers": 0,
        "attributes": {
            "REGION_s": clientRegion,  
            "GAMEMODE_s": "FORTATHENA",
            "ALLOWBROADCASTING_b": true,
            "SUBREGION_s": "GB",
            "DCID_s": "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
            "tenant_s": "Fortnite",
            "MATCHMAKINGPOOL_s": "Any",
            "STORMSHIELDDEFENSETYPE_i": 0,
            "HOTFIXVERSION_i": 0,
            "PLAYLISTNAME_s": "Playlist_DefaultSolo",
            "SESSIONKEY_s": generateRandomID(),
            "TENANT_s": "Fortnite",
            "BEACONPORT_i": 15009
        },
        "publicPlayers": [],
        "privatePlayers": [],
        "totalPlayers": 45,
        "allowJoinInProgress": false,
        "shouldAdvertise": false,
        "isDedicated": false,
        "usesStats": false,
        "allowInvites": false,
        "usesPresence": false,
        "allowJoinViaPresence": true,
        "allowJoinViaPresenceFriendsOnly": false,
        "buildUniqueId": buildUniqueId[accountId] || "0", 
        "lastUpdated": new Date().toISOString(),
        "started": false
    });
});

app.post("/fortnite/api/matchmaking/session/*/join", (req, res) => {
    res.status(204).end();
});

app.post("/fortnite/api/matchmaking/session/matchMakingRequest", (req, res) => {
    res.json([]);
});

console.log("Matchmaker IP Set To: " + process.env.MATCHMAKER_IP + ":" + process.env.MATCHMAKER_PORT);

module.exports = app;
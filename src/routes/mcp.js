const express = require("express");

const app = express();

const functions = require("../utils/functions.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function generateServerTime() {
    return new Date().toISOString();
}

app.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', (req, res) => {
    const { accountId } = req.params;
    const { profileId, rvn } = req.query;

    if (profileId !== 'athena') {
        return res.status(404).json({
            error: "Profile not found."
        });
    }

    res.status(200).json({
        profileRevision: rvn,
        profileId: profileId,
        profileChangesBaseRevision: rvn,
        profileCommandRevision: rvn,
        profileChanges: [],
        questUpdate: true,
        accountId: accountId,
        command: "ClientQuestLogin"
    });
});

module.exports = app;

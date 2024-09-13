const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/fortnite/api/game/v2/profile/:backend/client/SetReceiveGiftsEnabled", async (req, res) => {
    const backend = req.params.backend; 
    const { rvn, profileId, giftsEnabled } = req.body; 

    console.log(`Backend: ${backend}, Profile ID: ${profileId}, Receive Gifts Enabled: ${giftsEnabled}`);

    const response = {
        profileRevision: rvn + 1,  
        profileId: profileId,
        profileChangesBaseRevision: rvn,
        profileChanges: [
            {
                changeType: "statModified",
                name: "receive_gifts_enabled",
                value: giftsEnabled
            }
        ],
        profileCommandRevision: rvn + 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    };

    res.status(200).json(response);
});

app.post("/fortnite/api/game/v2/profile/:backend/client/ClientQuestLogin", (req, res) => {
    const { backend } = req.params;
    const { profileId, rvn } = req.query;

    if (profileId !== 'athena') {
        return res.status(400).json({ error: 'Invalid profile ID' });
    }

    const response = {
        profileRevision: parseInt(rvn) + 1,  
        profileId: profileId,
        profileChangesBaseRevision: rvn,
        profileChanges: [
            {
                changeType: "questCompleted",
                questId: "mock_quest_id",
                value: true
            }
        ],
        profileCommandRevision: parseInt(rvn) + 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    };

    res.status(200).json(response);
});

module.exports = app;
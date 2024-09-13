const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function generateServerTime() {
    return new Date().toISOString();
}

function incrementRevision(rvn) {
    return parseInt(rvn) + 1;
}

function validateProfileId(profileId, validProfiles) {
    return validProfiles.includes(profileId);
}

const questData = {
    athena: {
        questsCompleted: []
    }
};

app.post("/fortnite/api/game/v2/profile/:backend/client/SetReceiveGiftsEnabled", async (req, res) => {
    try {
        const backend = req.params.backend;
        const { rvn, profileId, giftsEnabled } = req.body;

        if (!rvn || !profileId || giftsEnabled === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log(`[INFO] Backend: ${backend}, Profile ID: ${profileId}, Receive Gifts Enabled: ${giftsEnabled}`);

        const response = {
            profileRevision: incrementRevision(rvn),
            profileId: profileId,
            profileChangesBaseRevision: rvn,
            profileChanges: [
                {
                    changeType: "statModified",
                    name: "receive_gifts_enabled",
                    value: giftsEnabled
                }
            ],
            profileCommandRevision: incrementRevision(rvn),
            serverTime: generateServerTime(),
            responseVersion: 1
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(`[ERROR] Failed to process SetReceiveGiftsEnabled: ${err.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/fortnite/api/game/v2/profile/:backend/client/ClientQuestLogin", (req, res) => {
    try {
        const { backend } = req.params;
        const { profileId, rvn } = req.query;

        const validProfiles = ['athena'];
        if (!validateProfileId(profileId, validProfiles)) {
            return res.status(400).json({ error: 'Invalid profile ID' });
        }
        if (!rvn) {
            return res.status(400).json({ error: 'Missing revision number (rvn)' });
        }

        console.log(`[INFO] Backend: ${backend}, Profile ID: ${profileId}, RVN: ${rvn}`);

        const questId = "mock_quest_id";
        if (!questData[profileId].questsCompleted.includes(questId)) {
            questData[profileId].questsCompleted.push(questId);
        }

        const response = {
            profileRevision: incrementRevision(rvn),
            profileId: profileId,
            profileChangesBaseRevision: rvn,
            profileChanges: [
                {
                    changeType: "questCompleted",
                    questId: questId,
                    value: true
                }
            ],
            profileCommandRevision: incrementRevision(rvn),
            serverTime: generateServerTime(),
            responseVersion: 1
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(`[ERROR] Failed to process ClientQuestLogin: ${err.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/fortnite/api/game/v2/profile/:backend/client/QueryProfile", (req, res) => {
    const { profileId } = req.query;
    const backend = req.params.backend;

    if (profileId === 'athena') {
        const profileData = {
            profileRevision: 2,
            profileId: 'athena',
            profileChangesBaseRevision: 1,
            profileChanges: [
                {
                    changeType: "statModified",
                    name: "favorite_cosmetic_loadout",
                    value: {
                        character: "CID_001_Athena_Commando_F_Default", 
                        pickaxe: "Pickaxe_Lockjaw", 
                        backpack: "BID_001_BackBling_Default" 
                    }
                }
            ],
            profileCommandRevision: 1,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        };
        return res.status(200).json(profileData);
    }

    return res.status(404).json({ error: "Profile not found" });
});

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;

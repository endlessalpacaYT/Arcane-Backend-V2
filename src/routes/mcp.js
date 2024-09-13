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
        const { profileId, rvn } = req.query;

        const validProfiles = ['athena'];
        if (!validateProfileId(profileId, validProfiles)) {
            return res.status(400).json({ error: 'Invalid profile ID' });
        }
        if (!rvn) {
            return res.status(400).json({ error: 'Missing revision number (rvn)' });
        }

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

app.post("/fortnite/api/game/v2/profile/:backend/client/SetCosmeticLockerSlot", async (req, res) => {
    const backend = req.params.backend; 
    const { rvn, profileId, slotName, itemToSlot } = req.body;  

    console.log(`Profile ID: ${profileId}, Slot Name: ${slotName}, Item to Slot: ${itemToSlot}`);

    if (!profileId || !rvn || !slotName || !itemToSlot) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const lockerState = {
        profileRevision: parseInt(rvn) + 1,
        profileId: profileId,
        locker: {
            character: "CID_001_Athena_Commando_F_Default",
            backpack: "BID_001_BackBling_Default",
            pickaxe: "Pickaxe_Lockjaw",
            glider: "Glider_ID_001_Default",
            emotes: [
                "EID_Wave",
                "EID_Clap"
            ]
        }
    };

    lockerState.locker[slotName] = itemToSlot;

    const response = {
        profileRevision: lockerState.profileRevision,
        profileId: profileId,
        profileChangesBaseRevision: rvn,
        profileChanges: [
            {
                changeType: "statModified",
                name: slotName,
                value: itemToSlot
            }
        ],
        profileCommandRevision: lockerState.profileRevision,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    };

    console.log(`Updated Locker Slot: ${slotName}, Item: ${itemToSlot}`);

    return res.status(200).json(response);
});

app.post("/fortnite/api/game/v2/profile/:accountId/dedicated_server/:operation", async (req, res) => {
    const { accountId, operation } = req.params;
    const { rvn, profileId } = req.body; 

    console.log(`Account ID: ${accountId}, Operation: ${operation}`);

    if (!profileId || !rvn) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    const profileRevision = rvn + 1;

    const response = {
        profileRevision: profileRevision,
        profileId: profileId,
        profileChangesBaseRevision: rvn,
        profileChanges: [
            {
                changeType: "operation",
                operationType: operation,
                success: true
            }
        ],
        profileCommandRevision: profileRevision,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    };

    return res.status(200).json(response);
});

app.post("/fortnite/api/game/v2/profile/:backend/client/SetCosmeticLockerBanner", async (req, res) => {
    const backend = req.params.backend;
    const { rvn, profileId, bannerIconId, bannerColorId } = req.body;

    console.log(`Profile ID: ${profileId}, Banner Icon: ${bannerIconId}, Banner Color: ${bannerColorId}`);

    if (!profileId || !rvn || !bannerIconId || !bannerColorId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const profileRevision = rvn + 1;

    const response = {
        profileRevision: profileRevision,
        profileId: profileId,
        profileChangesBaseRevision: rvn,
        profileChanges: [
            {
                changeType: "statModified",
                name: "banner_icon",
                value: bannerIconId
            },
            {
                changeType: "statModified",
                name: "banner_color",
                value: bannerColorId
            }
        ],
        profileCommandRevision: profileRevision,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    };

    return res.status(200).json(response);
});

app.post("/datarouter/api/v1/public/data", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.post('/presence/api/v1/Fortnite/:accountId/subscriptions/broadcast', (req, res) => {
    const accountId = req.params.accountId;

    return res.status(200).json({
        "status": "success",
        "message": `Presence broadcast received for account: ${accountId}`
    });
});

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;

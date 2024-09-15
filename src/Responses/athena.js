const express = require("express");

const app = express();

const User = require("../Models/user/user");
const UserV2 = require("../Models/user/userv2");

app.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', async (req, res) => {
    const { accountId } = req.params;

    const profileData = {
        "profileRevision": 1,
        "profileId": "athena",
        "profileChangesBaseRevision": 1,
        "profileChanges": [
            {
                "changeType": "itemAdded",
                "itemId": "item123",
                "item": {
                    "templateId": "CosmeticLocker:cosmeticlocker_athena",
                    "attributes": {
                        "locker_slots_data": {
                            "slots": {
                                "Character": {
                                    "items": ["AthenaCharacter:CID_001_Athena_Commando_F_Default"]
                                },
                                "Backpack": {
                                    "items": ["AthenaBackpack:DefaultBackpack"]
                                },
                                "Pickaxe": {
                                    "items": ["AthenaPickaxe:DefaultPickaxe"]
                                },
                                "Dance": {
                                    "items": ["AthenaDance:EID_DanceMoves"]
                                }
                            }
                        },
                        "item_seen": true,
                        "favorite": false
                    }
                }
            }
        ],
        "commandRevision": 1,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    };

    res.status(200).json(profileData);
});

module.exports = app;
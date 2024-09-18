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

app.post("/fortnite/api/game/v2/profile/*/client/:operation", async (req, res) => {
    const { accountId, operation } = req.params;

    switch (operation) {
        case "QueryProfile": break;
        case "ClientQuestLogin": break;
        case "RefreshExpeditions": break;
        case "GetMcpTimeForLogin": break;
        case "IncrementNamedCounterStat": break;
        case "SetHardcoreModifier": break;
        case "SetMtxPlatform": break;
        case "BulkEquipBattleRoyaleCustomization": break;

        default:
            error.createError(
                "arcane.errors.operation_not_found",
                `Operation ${operation} not valid`, 
                [operation], 16035, undefined, 404, res
            );
        return;
    }

    res.status(200);
});

module.exports = app;
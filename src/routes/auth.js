const Express = require("express");
const express = Express.Router();
const fs = require("fs");
const path = require("path");
const iniparser = require("ini");
const bcrypt = require("bcrypt");
const User = require("../Models/user.js");

express.use(Express.urlencoded({ extended: true }));

var Memory_CurrentAccountID = "ArcaneV2";

express.get("/account/api/public/account", async (req, res) => {
    var response = [];

    if (typeof req.query.accountId == "string") {
        var accountId = req.query.accountId;
        if (accountId.includes("@")) accountId = accountId.split("@")[0];

        response.push({
            "id": accountId,
            "displayName": accountId,
            "externalAuths": {}
        })
    }

    if (Array.isArray(req.query.accountId)) {
        for (var x in req.query.accountId) {
            var accountId = req.query.accountId[x];
            if (accountId.includes("@")) accountId = accountId.split("@")[0];

            response.push({
                "id": accountId,
                "displayName": accountId,
                "externalAuths": {}
            })
        }
    }

    res.json(response)
})

express.get("/account/api/public/account/:accountId", async (req, res) => {
    if (true) {
        Memory_CurrentAccountID = req.params.accountId;
    }

    if (Memory_CurrentAccountID.includes("@")) Memory_CurrentAccountID = Memory_CurrentAccountID.split("@")[0];

    res.json({
        "id": req.params.accountId,
        "displayName": Memory_CurrentAccountID,
        "name": "Arcane",
        "email": Memory_CurrentAccountID + "@arcane.com",
        "failedLoginAttempts": 0,
        "lastLogin": new Date().toISOString(),
        "numberOfDisplayNameChanges": 0,
        "ageGroup": "UNKNOWN",
        "headless": false,
        "country": "US",
        "lastName": "Server",
        "preferredLanguage": "en",
        "canUpdateDisplayName": false,
        "tfaEnabled": false,
        "emailVerified": true,
        "minorVerified": false,
        "minorExpected": false,
        "minorStatus": "NOT_MINOR",
        "cabinedMode": false,
        "hasHashedEmail": false
    })
})

express.get("/sdk/v1/*", async (req, res) => {
    const sdk = require("./../responses/sdkv1.json");
    res.json(sdk)
})

express.post("/auth/v1/oauth/token", async (req, res) => {
    res.json({
        "access_token": "arcanetoken",
        "token_type": "bearer",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "deployment_id": "arcanedeploymentid",
        "organization_id": "arcaneorganizationid",
        "product_id": "prod-fn",
        "sandbox_id": "fn",
        "displayName": Memory_CurrentAccountID
    })
})

express.get("/epic/id/v2/sdk/accounts", async (req, res) => {
    res.json([{
        "accountId": Memory_CurrentAccountID,
        "displayName": Memory_CurrentAccountID,
        "preferredLanguage": "en",
        "cabinedMode": false,
        "empty": false
    }])
})

express.post("/epic/oauth/v2/token", async (req, res) => {
    res.json({
        "scope": "basic_profile friends_list openid presence",
        "token_type": "bearer",
        "access_token": "arcanetoken",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "refresh_token": "arcanetoken",
        "refresh_expires_in": 86400,
        "refresh_expires_at": "9999-12-31T23:59:59.999Z",
        "account_id": Memory_CurrentAccountID,
        "client_id": "arcaneclientid",
        "application_id": "arcaneapplicationid",
        "selected_account_id": Memory_CurrentAccountID,
        "id_token": "arcanetoken"
    })
})

express.get("/account/api/public/account/*/externalAuths", async (req, res) => {
    res.json([])
})

express.delete("/account/api/oauth/sessions/kill", async (req, res) => {
    res.status(204);
    res.end();
})

express.delete("/account/api/oauth/sessions/kill/*", async (req, res) => {
    res.status(204);
    res.end();
})

express.get("/account/api/oauth/verify", async (req, res) => {
    res.json({
        "token": "arcanetoken",
        "session_id": "3c3662bcb661d6de679c636744c66b62",
        "token_type": "bearer",
        "client_id": "arcaneclientid",
        "internal_client": true,
        "client_service": "fortnite",
        "account_id": Memory_CurrentAccountID,
        "expires_in": 28800,
        "expires_at": "9999-12-02T01:12:01.100Z",
        "auth_method": "exchange_code",
        "display_name": Memory_CurrentAccountID,
        "app": "fortnite",
        "in_app_id": Memory_CurrentAccountID,
        "device_id": "arcanedeviceid"
    })
})

express.post("/account/api/oauth/token", async (req, res) => {
    const { grant_type, username, password } = req.body;

    const user = await User.findOne({ email: username });
    try {
        Memory_CurrentAccountID = user.username;
    }catch {
        console.log(req.body);
    }
    

    if (Memory_CurrentAccountID.includes("@")) Memory_CurrentAccountID = Memory_CurrentAccountID.split("@")[0];

    res.json({
        "access_token": "arcanetoken",
        "expires_in": 28800,
        "expires_at": "9999-12-02T01:12:01.100Z",
        "token_type": "bearer",
        "refresh_token": "arcanetoken",
        "refresh_expires": 86400,
        "refresh_expires_at": "9999-12-02T01:12:01.100Z",
        "account_id": Memory_CurrentAccountID,
        "client_id": "arcaneclientid",
        "internal_client": true,
        "client_service": "fortnite",
        "displayName": Memory_CurrentAccountID,
        "app": "fortnite",
        "in_app_id": Memory_CurrentAccountID,
        "device_id": "arcanedeviceid"
    })
})

express.post("/account/api/oauth/exchange", async (req, res) => {
    res.json({})
})

express.get("/account/api/epicdomains/ssodomains", async (req, res) => {
    res.json([
        "unrealengine.com",
        "unrealtournament.com",
        "fortnite.com",
        "epicgames.com"
    ])
})

express.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(true);
})

express.get('/lightswitch/api/service/bulk/status', (req, res) => {
    const statusResponse = [
        {
            serviceInstanceId: "fortnite",
            status: "UP", 
            message: "Fortnite is online.",
            maintenanceUri: null,
            allowedActions: ["PLAY", "DOWNLOAD"],
            launcherInfoDTO: {
                appName: "Fortnite",
                catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
                namespace: "fn"
            }
        }
    ];

    res.json(statusResponse);  
});

express.get('/fortnite/api/game/v2/enabled_features', (req, res) => {
    const enabledFeaturesResponse = [
        {
            "featureName": "BattleRoyale",
            "enabled": true
        },
        {
            "featureName": "CreativeMode",
            "enabled": true
        }
    ];

    res.json(enabledFeaturesResponse);
});

express.post('/fortnite/api/game/v2/grant_access/:backend', (req, res) => {
    const backend = req.params.backend;

    const grantAccessResponse = {
        "accountId": "94b1569506b04f9f8557af611e8c5e47",  
        "backendName": backend,
        "accessGranted": true,
        "message": `${backend} access granted.`
    };

    res.json(grantAccessResponse);
});

const mockProfileData = (profileId) => {
    const baseProfile = {
        "profileRevision": 1,
        "profileId": profileId,
        "profileChangesBaseRevision": 1,
        "profileChanges": [],
        "profileCommandRevision": 1,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    };

    if (profileId === "common_public") {
        return {
            ...baseProfile,
            "items": {
                "item123": {
                    "templateId": "Token:defaultToken",
                    "attributes": {
                        "level": 100,
                        "xp": 0
                    }
                }
            },
            "stats": {
                "attributes": {
                    "last_save_date": new Date().toISOString(),
                    "season_number": 12
                }
            }
        };
    } else if (profileId === "common_core") {
        return {
            ...baseProfile,
            "items": {
                "item456": {
                    "templateId": "Hero:defaultHero",
                    "attributes": {
                        "hero_level": 50,
                        "hero_xp": 2000
                    }
                }
            },
            "stats": {
                "attributes": {
                    "last_save_date": new Date().toISOString(),
                    "account_level": 80
                }
            }
        };
    } else {
        return baseProfile; 
    }
};

express.post('/fortnite/api/game/v2/profile/:backend/client/QueryProfile', (req, res) => {
    const { profileId } = req.query; 
    const profileData = mockProfileData(profileId);

    res.json(profileData);
});

express.post('/fortnite/api/game/v2/profile/:backend/client/SetMtxPlatform', (req, res) => {
    const { profileId, rvn } = req.query;

    const response = {
        profileRevision: parseInt(rvn) + 1,
        profileId: profileId,
        profileChangesBaseRevision: parseInt(rvn),
        profileChanges: [],
        profileCommandRevision: parseInt(rvn) + 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    };

    res.json(response);
});

const keychain = require("./../responses/keychain.json");

express.get("/fortnite/api/storefront/v2/catalog", async (req, res) => {
    res.status(200).json({ message: "Catalog fetched successfully" });
});

express.get("/fortnite/api/storefront/v2/keychain", async (req, res) => {
    res.json(keychain)
})

express.get("/catalog/api/shared/bulk/offers", async (req, res) => {
    res.json({});
})

module.exports = express;
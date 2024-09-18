const Express = require("express");
const express = Express.Router();
const fs = require("fs");
const path = require("path");
const iniparser = require("ini");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require("../Models/user/user.js");
const UserV2 = require("../Models/user/userv2.js");
const Token = require("../Models/token.js");

express.use(Express.urlencoded({ extended: true }));

var Memory_CurrentDisplayName = "ArcaneV2";
var Memory_CurrentAccountID = "";

const secretKey = process.env.JWT_SECRET || 'ArcaneV2';
const refreshSecretKey = process.env.JWT_SECRET || 'ArcaneV2';

function generateJWT(accountId, displayName, discordId) {
    const accessToken = jwt.sign(
        { accountId, displayName, discordId },
        secretKey,
        { expiresIn: '9999h' }  
    );

    const refreshToken = jwt.sign(
        { accountId, displayName, discordId },
        refreshSecretKey,
        { expiresIn: '9999h' }  
    );

    return { accessToken, refreshToken };
}

express.get("/account/api/public/account", async (req, res) => {
    var response = [];

    if (typeof req.query.AccountId == "string") {
        var AccountId = req.query.AccountId;
        if (AccountId.includes("@")) AccountId = AccountId.split("@")[0];

        response.push({
            "id": AccountId,
            "displayName": AccountId,
            "externalAuths": {}
        })
    }

    if (Array.isArray(req.query.AccountId)) {
        for (var x in req.query.AccountId) {
            var AccountId = req.query.AccountId[x];
            if (AccountId.includes("@")) AccountId = AccountId.split("@")[0];

            response.push({
                "id": AccountId,
                "displayName": AccountId,
                "externalAuths": {}
            })
        }
    }

    res.json(response)
})

express.get("/account/api/public/account/:AccountId", async (req, res) => {
    if (Memory_CurrentDisplayName.includes("@")) Memory_CurrentDisplayName = Memory_CurrentDisplayName.split("@")[0];

    res.json({
        "id": req.params.AccountId,
        "displayName": Memory_CurrentDisplayName,
        "name": "Arcane",
        "email": Memory_CurrentDisplayName + "@arcane.com",
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
    console.log("Requested [/auth/v1/oauth/token] Route");
    res.json({
        "access_token": "arcanetoken",
        "token_type": "bearer",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "deployment_id": "arcanedeploymentid",
        "organization_id": "arcaneorganizationid",
        "product_id": "prod-fn",
        "sandbox_id": "fn",
        "displayName": Memory_CurrentDisplayName
    })
})

express.get("/epic/id/v2/sdk/accounts", async (req, res) => {
    res.json([{
        "AccountId": Memory_CurrentAccountID,
        "displayName": Memory_CurrentDisplayName,
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

express.post("/account/api/oauth/refresh", async (req, res) => {
    const { refresh_token } = req.body;

    try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);

        const token = await Token.findOne({ refreshToken: refresh_token });
        if (!token) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const { accessToken, refreshToken } = generateJWT(token.accountId, token.displayName, token.discordId);

        token.token = accessToken;
        token.expiresAt = new Date(Date.now() + 28800 * 1000); 
        token.refreshToken = refreshToken;
        token.refreshExpiresAt = new Date(Date.now() + 86400 * 1000); 
        await token.save();

        res.json({
            access_token: accessToken,
            expires_in: 28800,
            expires_at: token.expiresAt,
            refresh_token: refreshToken,
            refresh_expires: 86400,
            refresh_expires_at: token.refreshExpiresAt,
            account_id: token.accountId,
            discordId: token.discordId,
            client_id: "arcaneclientid"
        });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
});

express.get("/account/api/oauth/verify", (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.warn("Token verification failed:", err.message);
        return res.status(200).json({
          "access_token": "fallback_token",
          "expires_in": 28800,
          "expires_at": "9999-12-02T01:12:01.100Z",
          "token_type": "bearer",
          "refresh_token": "fallback_refresh_token",
          "refresh_expires": 86400,
          "refresh_expires_at": "9999-12-02T01:12:01.100Z",
          "account_id": Memory_CurrentAccountID,
          "client_id": "arcaneclientid",
          "internal_client": true,
          "client_service": "fortnite",
          "displayName": Memory_CurrentDisplayName,
          "app": "fortnite",
          "in_app_id": Memory_CurrentAccountID,
          "device_id": "arcanedeviceid"
        });
      }
  
      res.status(200).json({
        "access_token": token,
        "expires_in": 28800,
        "expires_at": new Date(Date.now() + 28800 * 1000).toISOString(),
        "token_type": "bearer",
        "refresh_token": decoded.refreshToken,
        "refresh_expires": 86400,
        "refresh_expires_at": new Date(Date.now() + 86400 * 1000).toISOString(),
        "account_id": decoded.accountId,
        "client_id": "arcaneclientid",
        "internal_client": true,
        "client_service": "fortnite",
        "displayName": decoded.displayName,
        "app": "fortnite",
        "in_app_id": decoded.accountId,
        "device_id": "arcanedeviceid"
      });
    });
});

express.post("/account/api/oauth/token", async (req, res) => {
    const { grant_type, username, password } = req.body;

    let user = await UserV2.findOne({ Email: username }) || await User.findOne({ email: username });

    if (!user) {
        return res.status(401).json({
            "error": "arcane.errors.invalid.email"
        });
    }

    const validPassword = await bcrypt.compare(password, user.Password);
    if (!validPassword) {
        return res.status(401).json({
            "error": "arcane.errors.invalid.password"
        });
    }

    const Memory_CurrentDisplayName = user.Username || user.username || "ArcaneV2";
    const Memory_CurrentAccountID = user.Account || user.accountId;
    const discordId = user.Discord || user.discordId || "";

    const { accessToken, refreshToken } = generateJWT(Memory_CurrentAccountID, Memory_CurrentDisplayName, discordId);

    const token = new Token({
        token: accessToken,
        accountId: Memory_CurrentAccountID,
        expiresAt: new Date(Date.now() + 28800 * 1000), 
        refreshToken: refreshToken,
        refreshExpiresAt: new Date(Date.now() + 86400 * 1000) 
    });

    await token.save();

    res.json({
        access_token: accessToken,
        expires_in: 28800,
        expires_at: token.expiresAt,
        token_type: "bearer",
        refresh_token: refreshToken,
        refresh_expires: 86400,
        refresh_expires_at: token.refreshExpiresAt,
        account_id: Memory_CurrentAccountID,
        discordId: discordId,
        client_id: "arcaneclientid",
        internal_client: true,
        client_service: "fortnite",
        displayName: Memory_CurrentDisplayName,
        app: "fortnite",
        in_app_id: Memory_CurrentAccountID,
        device_id: "arcanedeviceid"
    });
});

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
        "AccountId": "94b1569506b04f9f8557af611e8c5e47",  
        "backendName": backend,
        "accessGranted": true,
        "message": `${backend} access granted.`
    };

    res.json(grantAccessResponse);
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

express.get("/fortnite/api/storefront/v2/keychain", async (req, res) => {
    res.json(keychain)
})

module.exports = express;
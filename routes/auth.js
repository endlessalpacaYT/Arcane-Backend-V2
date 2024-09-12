const express = require("express");
const app = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const error = require("../utils/error.js");
const functions = require("../utils/functions.js");
const createAccessToken = require('../tokenmanager/createAccessToken');
const createRefreshToken = require('../tokenmanager/createRefreshToken');
const validateToken = require('../tokenmanager/validateToken.js');
const generateExpiresAt = require('../tokenmanager/generateExpiresAt');
const User = require("../Models/user.js");
const ExchangeCode = require('../Models/Exchange-Code.js'); 

app.post("/account/api/oauth/token", async (req, res) => {
    let clientId;

    try {
        clientId = functions.DecodeBase64(req.headers["authorization"].split(" ")[1]).split(":");
        if (!clientId[1]) throw new Error("invalid client id");
        clientId = clientId[0];
    } catch {
        return error.createError(
            "errors.com.epicgames.common.oauth.invalid_client",
            "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.", 
            [], 1011, "invalid_client", 400, res
        );
    }

    switch (req.body.grant_type) {
        case "client_credentials":
            handleClientCredentials(clientId, req, res);
            return;

        case "password":
            handlePasswordGrant(req, res);
            return;

        case "refresh_token":
            handleRefreshTokenGrant(req, res);
            return;

        case "exchange_code":
            await handleExchangeCodeGrant(req, res);
            return;

        default:
            error.createError(
                "errors.com.epicgames.common.oauth.unsupported_grant_type",
                `Unsupported grant type: ${req.body.grant_type}`, 
                [], 1016, "unsupported_grant_type", 400, res
            );
            return;
    }
});

async function handleClientCredentials(clientId, req, res) {
    const ip = req.ip;
    let clientTokenIndex = global.clientTokens.findIndex(i => i.ip == ip);
    if (clientTokenIndex != -1) global.clientTokens.splice(clientTokenIndex, 1);

    const token = createAccessToken(clientId, req.body.grant_type, ip, 4); 
    functions.UpdateTokens();

    const decodedClient = jwt.decode(token);
    res.json({
        access_token: `eg1~${token}`,
        expires_in: generateExpiresAt(decodedClient),
        expires_at: generateExpiresAt(decodedClient, true),
        token_type: "bearer",
        client_id: clientId,
        internal_client: true,
        client_service: "fortnite"
    });
}

async function handlePasswordGrant(req, res) {
    if (!req.body.username || !req.body.password) {
        return error.createError(
            "errors.com.epicgames.common.oauth.invalid_request",
            "Username/password is required.", 
            [], 1013, "invalid_request", 400, res
        );
    }

    const { username: email, password } = req.body;
    req.user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!req.user || !await bcrypt.compare(password, req.user.password)) {
        return error.createError(
            "errors.com.epicgames.account.invalid_account_credentials",
            "Your e-mail and/or password are incorrect. Please check them and try again.", 
            [], 18031, "invalid_grant", 400, res
        );
    }

    issueTokens(req, res);
}

async function handleRefreshTokenGrant(req, res) {
    if (!req.body.refresh_token) {
        return error.createError(
            "errors.com.epicgames.common.oauth.invalid_request",
            "Refresh token is required.", 
            [], 1013, "invalid_request", 400, res
        );
    }

    const refresh_token = req.body.refresh_token;
    let refreshTokenIndex = global.refreshTokens.findIndex(i => i.token == refresh_token);
    let refreshObject = global.refreshTokens[refreshTokenIndex];

    try {
        if (refreshTokenIndex == -1) throw new Error("Refresh token invalid.");
        let decodedRefreshToken = jwt.decode(refresh_token.replace("eg1~", ""));
        if (validateToken(decodedRefreshToken)) throw new Error("Expired refresh token.");
    } catch {
        if (refreshTokenIndex != -1) global.refreshTokens.splice(refreshTokenIndex, 1);
        functions.UpdateTokens();

        return error.createError(
            "errors.com.epicgames.account.auth_token.invalid_refresh_token",
            `Sorry the refresh token '${refresh_token}' is invalid`, 
            [refresh_token], 18036, "invalid_grant", 400, res
        );
    }

    req.user = await User.findOne({ accountId: refreshObject.accountId }).lean();
    issueTokens(req, res);
}

async function handleExchangeCodeGrant(req, res) {
    if (!req.body.exchange_code) {
        return error.createError(
            "errors.com.epicgames.common.oauth.invalid_request",
            "Exchange code is required.", 
            [], 1013, "invalid_request", 400, res
        );
    }

    const { exchange_code: code } = req.body;
    try {
        const exchangeCodeRecord = await ExchangeCode.findOne({ code });
        if (!exchangeCodeRecord || exchangeCodeRecord.used || exchangeCodeRecord.expires_at < Date.now()) {
            return res.status(400).json({
                error: "Invalid or expired exchange code"
            });
        }

        exchangeCodeRecord.used = true;
        await exchangeCodeRecord.save();

        const { user_id, username } = exchangeCodeRecord;

        const accessToken = jwt.sign(
            {
                user_id,
                username,
                clid: "ec684b8c687f479fadea3cb2ad83f5c6", 
                am: "exchange_code", 
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } 
        );

        const refreshToken = jwt.sign(
            {
                user_id,
                username,
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } 
        );

        const accessExpiresIn = 7200; 
        const refreshExpiresIn = 28800; 
        const accessExpiresAt = new Date(Date.now() + accessExpiresIn * 1000).toISOString();
        const refreshExpiresAt = new Date(Date.now() + refreshExpiresIn * 1000).toISOString();

        return res.json({
            access_token: `eg1~${accessToken}`,
            expires_in: accessExpiresIn,
            expires_at: accessExpiresAt,
            token_type: "bearer",
            refresh_token: `eg1~${refreshToken}`,
            refresh_expires: refreshExpiresIn,
            refresh_expires_at: refreshExpiresAt,
            account_id: user_id,
            client_id: uuidv4(),
            internal_client: true,
            client_service: "prod-fn",
            displayName: username,
            app: "prod-fn",
            in_app_id: user_id,
            product_id: "prod-fn",
            application_id: "fghi4567FNFBKFz3E4TROb0bmPS8h1GW"
        });
    } catch (err) {
        console.error('Error:', err);
        if (!res.headersSent) {
            return res.status(500).json({
                error: "arcane.errors.server_error",
                message: err.message
            });
        }
    }
}

function issueTokens(req, res) {
    if (req.user.banned) {
        return error.createError(
            "errors.com.epicgames.account.account_not_active",
            "You have been permanently banned from Fortnite.", 
            [], -1, undefined, 400, res
        );
    }

    const deviceId = functions.MakeID().replace(/-/g, "");
    const accessToken = createAccessToken(req.user, clientId, req.body.grant_type, deviceId, 8);
    const refreshToken = createRefreshToken(req.user, clientId, req.body.grant_type, deviceId, 24); 
    functions.UpdateTokens();

    const decodedAccess = jwt.decode(accessToken);
    const decodedRefresh = jwt.decode(refreshToken);

    res.json({
        access_token: `eg1~${accessToken}`,
        expires_in: generateExpiresAt(decodedAccess),
        expires_at: generateExpiresAt(decodedAccess, true),
        token_type: "bearer",
        refresh_token: `eg1~${refreshToken}`,
        refresh_expires: generateExpiresAt(decodedRefresh),
        refresh_expires_at: generateExpiresAt(decodedRefresh, true),
        account_id: req.user.accountId,
        client_id: clientId,
        internal_client: true,
        client_service: "fortnite",
        displayName: req.user.username,
        app: "fortnite",
        in_app_id: req.user.accountId,
        device_id: deviceId
    });
}

module.exports = app;
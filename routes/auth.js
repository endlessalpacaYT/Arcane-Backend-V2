const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = require('../Models/user.js'); 
const ExchangeCode = require('../Models/Exchange-Code.js');

const createAccessToken = require('./tokenmanager/createAccessToken');
const createRefreshToken = require('./tokenmanager/createRefreshToken');
const generateExpiresAt = require('./tokenmanager/generateExpiresAt');

const app = express();
const global = { clientTokens: [] }; 

app.use(express.urlencoded({ extended: true }));

function DateAddHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

app.post('/account/api/oauth/token', async (req, res) => {
    try {
        const deviceId = uuidv4();
        let clientId;

        console.log("Headers: ", req.headers); 
        console.log("Body: ", req.body);

        const { grant_type, username, password, code } = req.body;

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Epic-Device-ID': deviceId,
        };

        if (grant_type === "client_credentials") {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Basic ')) {
                return res.status(401).json({ error: 'Missing or invalid authorization header' });
            }
            
            const base64Credentials = authHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString().split(':');
            const clientId = credentials[0];
            const clientSecret = credentials[1];

            const token = jwt.sign(
                {
                    client_id: clientId,
                    client_service: 'prod-fn',
                    aud: 'fortnite-service',
                    iss: 'arcane-backend',
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            const expiresIn = 28800; 
            const currentTime = new Date(); 
            const expiresAt = new Date(currentTime.getTime() + expiresIn * 1000).toISOString();

            return res.json({
                "access_token": "41ff4aeaede44f62b81a57688b0b6ef3",
                "expires_in": expiresIn,
                "expires_at": expiresAt,
                "token_type": "bearer",
                "client_id": clientId,
                "internal_client": true,
                "client_service": "prod-fn",
                "product_id": "prod-fn",
                "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW"
            });
        }

        if (grant_type === 'password') {
            const user = await User.findOne({ email: username });
            if (!user) {
                return res.status(401).json({ error: 'arcane.errors.login.invalid.email' });
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'arcane.errors.login.invalid.password' });
            }
    
            const token = createAccessToken({ user_id: user._id, username: user.username, email: user.email });
            const expiresIn = 28800;
            const expiresAt = generateExpiresAt(expiresIn);
    
            return res.json({
                access_token: `eg1~${token}`,
                expires_in: expiresIn,
                expires_at: expiresAt,
                token_type: 'bearer',
                client_id: user.accountId,
                product_id: 'prod-fn',
                application_id: 'fghi4567FNFBKFz3E4TROb0bmPS8h1GW'
            });
        }

        if (grant_type === "exchange_code") {
            const exchangeCodeRecord = await ExchangeCode.findOne({ code });
            clientId = uuidv4();
            
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
                client_id: clientId, 
                internal_client: true,
                client_service: "prod-fn",
                displayName: username,
                app: "prod-fn",
                in_app_id: user_id,
                product_id: "prod-fn",
                application_id: "fghi4567FNFBKFz3E4TROb0bmPS8h1GW"
            });
        }
    
        return res.status(400).json({
            error: "arcane.errors.login.invalid_grant_type"
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
});

app.get("/account/api/oauth/verify", (req, res) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1].replace("eg1~", ""); 

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const expiresIn = Math.round((decodedToken.exp * 1000 - Date.now()) / 1000); 
        const expiresAt = new Date(decodedToken.exp * 1000).toISOString();

        res.json({
            token: `eg1~${token}`,  
            session_id: decodedToken.jti || "****", 
            token_type: "bearer",
            client_id: decodedToken.clid || "34a02cf8f4414e29b15921876da36f9a", 
            internal_client: true,
            client_service: "launcher",
            account_id: decodedToken.user_id || "94b1569506b04f9f8557af611e8c5e47", 
            expires_in: expiresIn,  
            expires_at: expiresAt,  
            auth_method: decodedToken.am || "exchange_code", 
            display_name: decodedToken.username || "arcane", 
            app: "launcher",
            in_app_id: decodedToken.user_id || "94b1569506b04f9f8557af611e8c5e47", 
            perms: [
                {
                    resource: "launcher:download:live",
                    action: 2
                },
                {
                    resource: "catalog:shared:*",
                    action: 2
                }
            ]
        });
    });
});

module.exports = app;
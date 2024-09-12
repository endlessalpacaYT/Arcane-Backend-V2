const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/user.js'); 

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

        const { grant_type, username, password } = req.body;

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

        if (grant_type == 'password') {
            const user = await User.findOne({ email: username });
            if (!user) {
                return res.status(401).json({
                     error: 'arcane.errors.login.invalid.email' 
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                     error: 'arcane.errors.login.invalid.password' 
                });
            }

            const token = jwt.sign(
                {
                    user_id: user._id,
                    username: user.username,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            const expiresIn = 28800; 
            const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

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

module.exports = app;
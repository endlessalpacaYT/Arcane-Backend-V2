const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/user.js'); // Adjust the path as necessary

const app = express();
const global = { clientTokens: [] }; // Unused but could be removed if not needed

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure JSON parsing is enabled

function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

app.post('/account/api/oauth/token', async (req, res) => {
    try {
        console.log("Headers:", req.headers); 
        console.log("Body:", req.body);

        const { grant_type, username, password, code } = req.body; // Added 'code' for authorization_code grant
        const clientId = 'epic-games-client'; 

        if (grant_type === 'authorization_code') {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Basic ')) {
                return res.status(400).json({ error: 'Missing or invalid authorization header' });
            }

            const [clientId, clientSecret] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

            if (clientId !== 'correct_client_id' || clientSecret !== 'correct_client_secret') {
                return res.status(401).json({ error: 'Invalid client credentials' });
            }

            if (code !== 'valid_authorization_code') {
                return res.status(400).json({ error: 'Invalid authorization code' });
            }

            const accessToken = jwt.sign(
                { account_id: '94b1569506b04f9f8557af611e8c5e47', client_id: clientId, scope: ['basic_profile'], product_id: 'prod-fn', application_id: 'fghi4567FNFBKFz3E4TROb0bmPS8h1GW' },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            const refreshToken = jwt.sign(
                { account_id: '94b1569506b04f9f8557af611e8c5e47' },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({
                access_token: accessToken,
                expires_in: 7200,
                expires_at: addHours(new Date(), 2).toISOString(),
                token_type: 'bearer',
                refresh_token: refreshToken,
                refresh_expires_in: 28800,
                refresh_expires_at: addHours(new Date(), 8).toISOString(),
                account_id: '94b1569506b04f9f8557af611e8c5e47',
                client_id: clientId,
                internal_client: true,
                client_service: 'prod-fn',
                scope: ['basic_profile'],
                displayName: 'SampleUser',
                app: 'prod-fn',
                in_app_id: '94b1569506b04f9f8557af611e8c5e47',
                device_id: '63e3b71af76e4fc48841b92c5eb3d69d',
                product_id: 'prod-fn',
                application_id: 'fghi4567FNFBKFz3E4TROb0bmPS8h1GW',
            });
        }

        if (grant_type === 'password') {
            if (!username || !password) {
                return res.status(400).json({ error: 'Missing username or password' });
            }

            const user = await User.findOne({ email: { $regex: new RegExp(`^${username.trim()}$`, 'i') } });

            if (!user) {
                return res.status(401).json({ error: "arcane.errors.login.invalid_email" });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: "arcane.errors.login.invalid_password" });
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                access_token: token,
                expires_in: 86400,
                token_type: "bearer"
            });
        }

        if (grant_type === 'client_credentials') {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Basic ')) {
                return res.status(400).json({ error: 'Missing or invalid authorization header' });
            }

            const [clientId, clientSecret] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

            if (clientId !== 'correct_client_id' || clientSecret !== 'correct_client_secret') {
                return res.status(401).json({ error: 'Invalid client credentials' });
            }

            const token = jwt.sign(
                { client_id: clientId, client_service: 'prod-fn', product_id: 'prod-fn', application_id: 'fghi4567FNFBKFz3E4TROb0bmPS8h1GW' },
                process.env.JWT_SECRET,
                { expiresIn: '4h' }
            );

            return res.json({
                access_token: `eg1~${token}`,
                expires_in: 14400,
                expires_at: addHours(new Date(), 4).toISOString(),
                token_type: 'bearer',
                client_id: clientId,
                internal_client: true,
                client_service: 'prod-fn',
                product_id: 'prod-fn',
                application_id: 'fghi4567FNFBKFz3E4TROb0bmPS8h1GW',
            });
        }

        return res.status(400).json({ error: "arcane.errors.login.invalid_grant_type" });
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

app.get('/fortnite/api/stats/accountId/:accountId/bulk/window/alltime', (req, res) => {
    const accountId = req.params.accountId;

    return res.json({
        startTime: "2022-01-01T00:00:00.000Z",
        endTime: "2022-12-31T23:59:59.000Z",
        stats: {
            kills: 100,
            wins: 10,
            matchesPlayed: 500
        }
    });
});

app.get('/fortnite/api/cloudstorage/system', (req, res) => {
    return res.json([
        {
            fileName: "Hotfixes_CloudStorage",
            filePath: "/hotfixes/",
            version: "1",
            fileHash: "abc123",
            fileSize: 1024
        }
    ]);
});

app.post('/datarouter/api/v1/public/data', (req, res) => {
    return res.status(200).json({ status: "success" });
});

module.exports = app;

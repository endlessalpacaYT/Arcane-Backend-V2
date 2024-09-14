const express = require("express");

const app = express();

const Profile = require("../Models/profile");
const User = require("../Models/user/user");
const UserV2 = require("../Models/user/userv2");
const Friends = require("../Models/friends/friends");
const Party = require("../Models/party/party");
const Invites = require("../Models/party/invites")
const Notification = require("../Models/party/notification")

app.get('/account/api/public/account/displayName/:displayName', async (req, res) => {
    try {
        const { displayName } = req.params;

        let userV2 = await UserV2.findOne({ Username: displayName });
        let user; 
        
        if (!userV2) {
            user = await User.findOne({ username: displayName });
            if (!user) {
                return res.status(404).json({
                    error: "arcane.errors.displayname.not_found",
                });
            }
        }

        const responseUser = userV2 ? userV2 : user;

        res.status(200).json({
            id: responseUser.Account || responseUser.accountId,  
            displayName: responseUser.Username || responseUser.username,  
            externalAuths: {}  
        });

    } catch (err) {
        console.error('Error fetching user by displayName:', err);
        res.status(500).json({
            error: "arcane.errors.server_error",
            message: "The server encountered an error while processing the request"
        });
    }
});

app.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', async (req, res) => {
    const { accountId } = req.params;
    const { profileId, rvn } = req.query;

    try {
        let profile = await Profile.findOne({ accountId: profileId });

        try {
            if (!profile) {
                profile = new Profile({
                    accountId: accountId,
                    profileId: profileId,
                    profileRevision: parseInt(rvn) + 1
                });
                await profile.save();
                console.log("New User Profile Data Saved, Player: " + accountId);
            } else {
                profile.profileRevision = parseInt(rvn) + 1;
                profile.profileCommandRevision = parseInt(rvn) + 1;
                await profile.save();
            }
        }catch (err) {
            console.log("[ERROR] Failed To Save Profile Data To MongoDB: " + err);
        }

        res.json({
            profileId: profile.profileId,
            profileRevision: profile.profileRevision,
            profileChangesBaseRevision: rvn,
            profileCommandRevision: profile.profileCommandRevision,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
})

app.post('/api/v1/user/setting', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/content-controls/:accountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/content-controls/:accountId/rules/namespaces/fn', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/fortnite/api/receipts/v1/account/:accountId/receipts', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/socialban/api/public/v1/:accountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/fortnite/api/statsv2/account/:accountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

module.exports = app;
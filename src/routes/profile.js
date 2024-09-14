const express = require("express");

const app = express();

const Profile = require("../Models/profile");

app.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', async (req, res) => {
    const { accountId } = req.params;
    const { profileId, rvn } = req.query;

    try {
        let profile = await Profile.findOne({ accountId, profileId });

        try {
            if (!profile) {
                profile = new Profile({
                    accountId,
                    profileId,
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
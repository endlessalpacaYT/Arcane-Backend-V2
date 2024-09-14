const express = require("express");

const app = express();

const User = require("../Models/user/user");
const UserV2 = require("../Models/user/userv2");

app.get('/party/api/v1/Fortnite/user/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;

        var userV2 = await UserV2.findOne({ Account: accountId });
        if (!userV2) {
            user = await User.findOne({ accountId: accountId });
            if (!user) {
                return res.status(401).json({
                    "error": "arcane.errors.invalid.accountid"
                });
            }
        }

        res.json({
            partyId: accountId,
            partyMembers: [],
            leaderId: accountId
        })
        console.log("[INFO] Party Created For AccountId: " + accountId);
    }catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/user/:accountId",
            status: 500
        })
        console.log("error: /party/api/v1/Fortnite/user/:accountId : " + err)
    }
})

app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/join', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/leave', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.post('/party/api/v1/Fortnite/parties/:partyId/invitations/:accountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.delete('/party/api/v1/Fortnite/parties/:partyId/members/:accountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/party/api/v1/Fortnite/parties/:partyId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.patch('/party/api/v1/Fortnite/parties/:partyId/privacy', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.post('/party/api/v1/Fortnite/parties/:partyId/invitations', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/accept', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/decline', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/party/api/v1/Fortnite/parties/:partyId/members/:accountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

module.exports = app;
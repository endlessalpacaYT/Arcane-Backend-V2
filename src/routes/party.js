const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();

const User = require("../Models/user/user");
const UserV2 = require("../Models/user/userv2");
const Party = require("../Models/party");

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

        try {
            currentParty = await Party.findOne({ leaderId: accountId });
            if (!currentParty) {
                const partyId = uuidv4();
                const party = new Party ({
                    partyId: partyId,
                    leaderId: accountId,
                    members: [{
                        memberId: accountId, 
                        readyState: "NOT_READY",
                        isLeader: true,
                        platform: "Windows",
                        joinTime: Date.now()
                    }],
                    isJoinable: true,
                    privacySettings: "PUBLIC"
                });

                currentParty = await party.save();
                console.log("New Party Data Saved, partyId: " + partyId)
            };
        }catch (err) {
            return console.log("Error Saving Party: " + err);
        }

        res.json({
            partyId: currentParty.partyId,
            leaderId: currentParty.leaderId,
            partyMembers: currentParty.members,
            isJoinable: currentParty.isJoinable,
            privacySettings: currentParty.privacySettings
        });
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

app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/join', async (req, res) => {
    try {
        const { partyId, accountId } = req.params;

        const targetParty = await Party.findOne({ partyId: partyId });
        if (!targetParty) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            })
        }

        if (targetParty.isJoinable == false) {
            return res.status(403).json({
                error: "arcane.errors.party.not_joinable"
            })
        }

        try {
            const isInParty = targetParty.members.find(member => member.memberId === accountId)
            if (!isInParty) {
                targetParty.members.push({
                    memberId: accountId,
                    readyState: "NOT_READY",
                    isLeader: false,
                    platform: "Windows",
                    joinTime: Date.now() 
                })
    
                targetParty.save()
                res.status(200).json({
                    status: 200
                });
            }else {
                return res.json({
                    error: "arcane.errors.player.already_in_party"
                })
            }
        }catch (err) {
            console.log("document failed to save: " + err);
            return res.json({
                error: "arcane.errors.database_document.failed_to_save"
            })
        }

    }catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId/members/:accountId/join",
            status: 500
        })
        console.log("error: /party/api/v1/Fortnite/user/:accountId : " + err)
    }
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
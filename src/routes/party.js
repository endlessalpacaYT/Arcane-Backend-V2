const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();

const User = require("../Models/user/user");
const UserV2 = require("../Models/user/userv2");
const Party = require("../Models/party/party");
const Invites = require("../Models/party/invites")
const Notification = require("../Models/party/notification")

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
        console.log("error: /party/api/v1/Fortnite/parties/:partyId/members/:accountId/join : " + err)
    }
})

app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/leave', async (req, res) => {
    try {
        const { partyId, accountId } = req.params;

        const currentParty = await Party.findOne({ partyId: partyId });
        if (!currentParty) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            });
        }

        const memberIndex = currentParty.members.findIndex(member => member.memberId === accountId);
        if (memberIndex === -1) {
            return res.status(404).json({
                error: "arcane.errors.player.not_in_party"
            });
        }

        currentParty.members.splice(memberIndex, 1);

        if (currentParty.leaderId === accountId) {
            if (currentParty.members.length > 0) {
                currentParty.leaderId = currentParty.members[0].memberId;
            } else {
                await currentParty.deleteOne();
                return res.status(200).json({
                    status: 200
                });
            }
        }

        await currentParty.save();

        res.status(200).json({
            message: `Member ${accountId} has left the party.`,
            partyId: partyId
        });
        console.log(`Member ${accountId} has left the party.`);

    }catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId/members/:accountId/leave",
            status: 500
        });
        console.log("error: /party/api/v1/Fortnite/parties/:partyId/members/:accountId/leave : " + err);
    }
});

app.post('/party/api/v1/Fortnite/parties/:partyId/invitations/:accountId', async (req, res) => {
    try {
        const { partyId, accountId } = req.params;

        const targetParty = await Party.findOne({ partyId: partyId });
        if (!targetParty) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            });
        }

        if (targetParty.isJoinable == false) {
            return res.status(403).json({
                error: "arcane.errors.party.not_joinable"
            })
        }

        const isInParty = targetParty.members.find(member => member.memberId === accountId)
        if (isInParty == true) {
            return res.json({
                error: "arcane.errors.player.already_in_party"
            })
        }

        const invitationTime = Date.now();
        const expirationTime = Date.now() + 60000;

        const invite = new Invites({
            partyId: partyId,
            accountId: accountId,
            invitationTime: invitationTime,
            expirationTime: expirationTime
        })

        try {
            await invite.save();
        }catch (err) {
            console.log("document failed to save: " + err);
            return res.json({
                error: "arcane.errors.database_document.failed_to_save"
            })
        }

        res.status(200).json({
                "status": "success",
                "message": "Invitation sent successfully.",
                "partyId": partyId,
                "accountId": accountId,
                "invitatationTime": invitationTime,
                "expirationTime": expirationTime
        })
        
    }catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId/invitations/:accountId",
            status: 500
        });
        console.log("error: /party/api/v1/Fortnite/parties/:partyId/invitations/:accountId : " + err);
    }
})

// Used chatgpt for like 25% of this one but idc
app.delete('/party/api/v1/Fortnite/parties/:partyId/members/:accountId', async (req, res) => {
    try {
        let { partyId, accountId } = req.params;

        let cutPartyId = partyId;

        if (partyId.startsWith("Creating_")) {
            cutPartyId = partyId.replace("Creating_", "");
        }

        let currentParty = await Party.findOne({ partyId: cutPartyId });
        
        if (!currentParty) {
            currentParty = await Party.findOne({
                $or: [
                    { leaderId: accountId },
                    { 'members.memberId': accountId }
                ]
            });

            if (!currentParty) {
                return res.status(404).json({
                    error: "arcane.errors.party.not_found"
                });
            }
        }

        const memberIndex = currentParty.members.findIndex(member => member.memberId === accountId);
        if (memberIndex === -1) {
            return res.status(404).json({
                error: "arcane.errors.player.not_in_party"
            });
        }

        currentParty.members.splice(memberIndex, 1);

        if (currentParty.leaderId === accountId) {
            if (currentParty.members.length > 0) {
                currentParty.leaderId = currentParty.members[0].memberId;
            } else {
                await currentParty.deleteOne();
                return res.status(200).json({
                    message: `Party ${cutPartyId} has been disbanded.`,
                    status: 200
                });
            }
        }

        await currentParty.save();

        res.status(200).json({
            message: `Member ${accountId} has been removed from the party.`,
            partyId: currentParty.partyId
        });
        console.log(`Member ${accountId} has been removed from the party.`);

    } catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId/members/:accountId",
            status: 500
        });
        console.log("Error: /party/api/v1/Fortnite/parties/:partyId/members/:accountId : " + err);
    }
});

app.get('/party/api/v1/Fortnite/parties/:partyId', async (req, res) => {
    try {
        const { partyId } = req.params;

        const party = await Party.findOne({ partyId: partyId });
        if (!party) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            })
        }

        res.status(200).json({
            partyId: party.partyId,
            leaderId: party.leaderId,
            partyMembers: party.members,
            isJoinable: party.isJoinable,
            privacySettings: party.privacySettings
        })
    }catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId",
            status: 500
        });
        console.log("Error: /party/api/v1/Fortnite/parties/:partyId : " + err);
    }
})

app.patch('/party/api/v1/Fortnite/parties/:partyId/privacy', async (req, res) => {
    try {
        const { partyId } = req.params;
        const { privacySettings } = req.body;  

        const party = await Party.findOne({ partyId: partyId });
        if (!party) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            });
        }

        party.privacySettings = privacySettings;

        await party.save();
        console.log("privacy settings updated: " + party.privacySettings)

        res.status(200).json({
            message: "Privacy settings updated successfully",
            partyId: party.partyId,
            privacySettings: party.privacySettings
        });

    } catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId/privacy",
            status: 500
        });
        console.log("Error: /party/api/v1/Fortnite/parties/:partyId/privacy : " + err);
    }
});

app.post('/party/api/v1/Fortnite/parties/:partyId/invitations', async (req, res) => {
    try {
        const { partyId } = req.params;
        const { recipientAccountId } = req.body;

        const party = await Party.findOne({ partyId: partyId });
        if (!party) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            });
        }

        if (!party.isJoinable) {
            return res.status(403).json({
                error: "arcane.errors.party.not_joinable"
            });
        }

        const isInParty = party.members.some(member => member.memberId === recipientAccountId);
        if (isInParty) {
            return res.status(400).json({
                error: "arcane.errors.player.already_in_party"
            });
        }

        const invitation = new Invites({
            partyId: partyId,
            accountId: recipientAccountId,
            invitationTime: Date.now(),
            expirationTime: Date.now() + 60000,  
        });

        try {
            await invitation.save();
        }catch (err) {
            console.log("Error saving invitation: " + err);
        }

        res.status(200).json({
            message: 'Invitation sent successfully',
            invitationId: invitation._id,
            expiresAt: invitation.expirationTime
        });
        console.log(`Invitation sent to ${recipientAccountId} for party ${partyId}.`);
    } catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId/invitations",
            status: 500
        });
        console.error("Error: /party/api/v1/Fortnite/parties/:partyId/invitations : " + err);
    }
});

// Used ChatGPT For This Route
app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/accept', async (req, res) => {
    try {
        const { partyId, accountId } = req.params;

        const invite = await Invites.findOne({ partyId: partyId, accountId: accountId });
        if (!invite) {
            return res.status(404).json({
                error: "arcane.errors.invite.not_found"
            });
        }

        const party = await Party.findOne({ partyId: partyId });
        if (!party) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            });
        }

        const isAlreadyInParty = party.members.some(member => member.memberId === accountId);
        if (isAlreadyInParty) {
            return res.status(400).json({
                error: "arcane.errors.player.already_in_party"
            });
        }

        party.members.push({
            memberId: accountId,
            readyState: "NOT_READY",
            isLeader: false,
            platform: "Windows",
            joinTime: Date.now()
        });

        await party.save();
        await invite.deleteOne(); 

        res.status(200).json({
            message: `Member ${accountId} has accepted the invitation to join party ${partyId}.`
        });
    } catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: `There was a problem accepting the invitation for party ${partyId}`,
            status: 500
        });
        console.error(`Error accepting invitation for party ${partyId}: ${err}`);
    }
});

// Used ChatGPT For This Route
app.post('/party/api/v1/Fortnite/parties/:partyId/members/:accountId/decline', async (req, res) => {
    try {
        const { partyId, accountId } = req.params;

        const invite = await Invites.findOne({ partyId: partyId, accountId: accountId });
        if (!invite) {
            return res.status(404).json({
                error: "arcane.errors.invite.not_found"
            });
        }

        await invite.deleteOne();

        res.status(200).json({
            message: `Member ${accountId} has declined the invitation to join party ${partyId}.`
        });
    } catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: `There was a problem declining the invitation for party ${partyId}`,
            status: 500
        });
        console.error(`Error declining invitation for party ${partyId}: ${err}`);
    }
});

app.get('/party/api/v1/Fortnite/parties/:partyId/members/:accountId', async (req, res) => {
    try {
        const { partyId, accountId } = req.params;

        const currentParty = await Party.findOne({ partyId: partyId });
        if (!currentParty) {
            return res.status(404).json({
                error: "arcane.errors.party.not_found"
            });
        }

        const member = currentParty.members.find(member => member.memberId === accountId);
        if (!member) {
            return res.status(404).json({
                error: "arcane.errors.player.not_in_party"
            });
        }

        res.status(200).json({
            memberId: member.memberId,
            readyState: member.readyState,
            isLeader: member.isLeader,
            platform: member.platform,
            joinTime: member.joinTime,
        });
    } catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server had a problem executing /party/api/v1/Fortnite/parties/:partyId/members/:accountId",
            status: 500
        });
        console.log("Error: /party/api/v1/Fortnite/parties/:partyId/members/:accountId : " + err);
    }
});

app.get('/party/api/v1/Fortnite/user/:accountId/notifications/undelivered/count', async (req, res) => {
    try {
        const { accountId } = req.params;
        
        const undeliveredNotifications = await Notification.find({ accountId: accountId, delivered: false });

        res.status(200).json({
            undeliveredCount: undeliveredNotifications.length,
            notifications: undeliveredNotifications 
        });

    } catch (err) {
        res.status(500).json({
            error: "errors.arcane.server_error",
            error_details: "The server encountered a problem processing the request",
            status: 500
        });
        console.log("Error: /party/api/v1/Fortnite/user/:accountId/notifications/undelivered/count : " + err);
    }
});

module.exports = app;
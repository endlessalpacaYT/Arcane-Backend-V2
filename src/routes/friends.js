const express = require("express");

const app = express();

const User = require("../Models/user/user");
const UserV2 = require("../Models/user/userv2");
const Friends = require("../Models/friends/friends");
const FriendRequest = require("../Models/friends/friendrequest");
const Party = require("../Models/party/party");
const Invites = require("../Models/party/invites")
const Notification = require("../Models/party/notification")

app.get('/friends/api/v1/:accountId/friends', async (req, res) => {
    try {
        const { accountId } = req.params;

        const userFriends = await Friends.findOne({ accountId: accountId });

        if (!userFriends || userFriends.friends.length === 0) {
            return res.status(200).json([]); 
        }

        const friendsList = [];

        for (let friend of userFriends.friends) {
            let friendData = await UserV2.findOne({ Account: friend.friendId }) || await User.findOne({ accountId: friend.friendId });

            if (friendData) {
                friendsList.push({
                    accountId: friendData.Account || friendData.accountId,
                    displayName: friendData.Username || friendData.username,
                    status: friend.status === 'active' ? 'ACCEPTED' : friend.status.toUpperCase(),  
                    lastLogin: friendData.lastLogin || new Date().toISOString(),  
                });
            }
        }

        res.status(200).json(friendsList);
    } catch (err) {
        console.error('Error fetching friends:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'The server had a problem executing /friends/api/v1/:accountId/friends',
            status: 500
        });
    }
});

app.post('/friends/api/v1/:accountId/friends/:friendAccountId', async (req, res) => {
    try {
        const { accountId, friendAccountId } = req.params;

        if (accountId === friendAccountId) {
            return res.status(400).json({
                error: 'arcane.errors.friend_request.invalid',
                message: 'You cannot add yourself as a friend.'
            });
        }

        let existingRequest = await FriendRequest.findOne({
            senderId: accountId,
            recipientId: friendAccountId
        });

        if (existingRequest) {
            return res.status(409).json({
                error: 'arcane.errors.friend_request.exists',
                message: 'Friend request already exists.'
            });
        }

        const friendData = await UserV2.findOne({ Account: friendAccountId }) || await User.findOne({ accountId: friendAccountId });
        if (!friendData) {
            return res.status(404).json({
                error: 'arcane.errors.friend_request.not_found',
                message: 'The account you are trying to add as a friend does not exist.'
            });
        }

        const newRequest = new FriendRequest({
            senderId: accountId,
            recipientId: friendAccountId,
            requestDate: Date.now(),
        });

        try {
            await newRequest.save();
            console.log(`Friend request from ${accountId} to ${friendAccountId} saved to DB`);
        }catch (err) {
            console.log("Failed To Save FriendRequest: " + err)
        }

        res.status(200).json({
            message: `Friend request sent to ${friendAccountId}`
        });

    } catch (err) {
        console.error('Error processing friend request:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'The server had a problem executing /friends/api/v1/:accountId/friends/:friendAccountId',
            status: 500
        });
    }
});

app.post('/friends/api/v1/:accountId/friends/:friendAccountId/accept', async (req, res) => {
    try {
        const { accountId, friendAccountId } = req.params;

        const friendRequest = await FriendRequest.findOne({
            senderId: friendAccountId,
            recipientId: accountId
        });

        if (!friendRequest) {
            return res.status(404).json({
                error: 'arcane.errors.friend_request.not_found',
                message: 'No pending friend request found.'
            });
        }

        let userFriends = await Friends.findOne({ accountId: accountId });
        if (!userFriends) {
            userFriends = new Friends({ accountId, friends: [] });
        }
        userFriends.friends.push({
            friendId: friendAccountId,
            status: 'active',
            addedAt: Date.now(),
            lastInteraction: Date.now(),
        });
        try {
            await userFriends.save();
        }catch (err) {
            console.log("Failed To Save Friend: " + err)
        }

        let friendFriends = await Friends.findOne({ accountId: friendAccountId });
        if (!friendFriends) {
            friendFriends = new Friends({ accountId: friendAccountId, friends: [] });
        }
        friendFriends.friends.push({
            friendId: accountId,
            status: 'active',
            addedAt: Date.now(),
            lastInteraction: Date.now(),
        });
        try {
            await friendFriends.save();
        }catch (err) {
            console.log("Failed To Save Friend: " + err)
        }

        await FriendRequest.deleteOne({ senderId: friendAccountId, recipientId: accountId });

        res.status(200).json({
            message: 'Friend request accepted successfully.'
        });

    } catch (err) {
        console.error('Error accepting friend request:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'The server encountered an error while processing the request.'
        });
    }
});

app.delete('/friends/api/v1/:accountId/friends/:friendAccountId', async (req, res) => {
    try {
        const { accountId, friendAccountId } = req.params;

        let userFriends = await Friends.findOne({ accountId: accountId });
        let friendFriends = await Friends.findOne({ accountId: friendAccountId });

        if (!userFriends || !friendFriends) {
            return res.status(404).json({
                error: 'arcane.errors.friend.not_found',
                message: 'Friend relationship not found'
            });
        }

        userFriends.friends = userFriends.friends.filter(friend => friend.friendId !== friendAccountId);
        friendFriends.friends = friendFriends.friends.filter(friend => friend.friendId !== accountId);

        await userFriends.save();
        await friendFriends.save();

        res.status(200).json({
            message: `Friendship between ${accountId} and ${friendAccountId} has been removed.`
        });
    } catch (err) {
        console.error('Error removing friend:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'Error processing friend removal.'
        });
    }
});

app.post('/friends/api/v1/:accountId/blocklist/:blockAccountId', async (req, res) => {
    try {
        const { accountId, blockAccountId } = req.params;

        let userFriends = await Friends.findOne({ accountId: accountId });
        if (!userFriends) {
            userFriends = new Friends({ accountId, friends: [], blocklist: [] });
        }

        const isBlocked = userFriends.blocklist.some(block => block.blockId === blockAccountId);
        if (isBlocked) {
            return res.status(409).json({
                error: 'arcane.errors.already_blocked',
                message: 'User already in blocklist.'
            });
        }

        userFriends.blocklist.push({
            blockId: blockAccountId,
            blockedAt: Date.now()
        });

        userFriends.friends = userFriends.friends.filter(friend => friend.friendId !== blockAccountId);

        await userFriends.save();

        res.status(200).json({
            message: `User ${blockAccountId} has been blocked.`
        });
    } catch (err) {
        console.error('Error blocking user:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'Error processing blocklist request.'
        });
    }
});

app.get('/friends/api/v1/:accountId/blocklist', async (req, res) => {
    try {
        const { accountId } = req.params;

        const userFriends = await Friends.findOne({ accountId: accountId });
        if (!userFriends || userFriends.blocklist.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(userFriends.blocklist);
    } catch (err) {
        console.error('Error fetching blocklist:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'Error fetching blocklist.'
        });
    }
});

app.get('/friends/api/public/blocklist/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;

        const userFriends = await Friends.findOne({ accountId: accountId });
        if (!userFriends || !userFriends.blocklist.length) {
            return res.status(200).json([]);
        }

        const blocklist = userFriends.blocklist.map(block => ({
            blockId: block.blockId,
            blockedAt: block.blockedAt
        }));

        res.status(200).json(blocklist);
    } catch (err) {
        console.error('Error fetching blocklist:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'Error fetching blocklist.'
        });
    }
});

app.delete('/friends/api/v1/:accountId/blocklist/:blockAccountId', async (req, res) => {
    try {
        const { accountId, blockAccountId } = req.params;

        const userFriends = await Friends.findOne({ accountId: accountId });
        if (!userFriends) {
            return res.status(404).json({
                error: 'arcane.errors.blocklist.not_found',
                message: 'Blocklist not found.'
            });
        }

        userFriends.blocklist = userFriends.blocklist.filter(block => block.blockId !== blockAccountId);

        await userFriends.save();

        res.status(200).json({
            message: `User ${blockAccountId} has been removed from blocklist.`
        });
    } catch (err) {
        console.error('Error removing from blocklist:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'Error removing user from blocklist.'
        });
    }
});

app.get('/friends/api/v1/:accountId/recent/:game', async (req, res) => {
    try {
        const { accountId, game } = req.params;

        const recentPlayers = await RecentPlayers.find({ accountId: accountId, game: game });

        if (!recentPlayers || recentPlayers.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(recentPlayers);
    } catch (err) {
        console.error('Error fetching recent players:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'Error fetching recent players.'
        });
    }
});

app.get('/friends/api/public/friends/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const includePending = req.query.includePending === 'true';

        const userFriends = await Friends.findOne({ accountId: accountId });

        if (!userFriends || userFriends.friends.length === 0) {
            return res.status(200).json([]); 
        }

        const friendsList = userFriends.friends.filter(friend => {
            return includePending || friend.status === 'active';
        }).map(friend => ({
            friendId: friend.friendId,
            status: friend.status,
            addedAt: friend.addedAt
        }));

        res.status(200).json(friendsList);
    } catch (err) {
        console.error('Error fetching friends:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'The server had a problem executing /friends/api/public/friends/:accountId',
            status: 500
        });
    }
});

app.get('/friends/api/v1/:accountId/settings', async (req, res) => {
    try {
        const { accountId } = req.params;

        const userFriends = await Friends.findOne({ accountId: accountId });

        if (!userFriends) {
            return res.status(404).json({
                error: 'arcane.errors.settings.not_found',
                message: 'Settings not found for this account.'
            });
        }

        res.status(200).json({
            privacy: userFriends.privacy || 'public', 
            notifications: userFriends.notifications || true 
        });
    } catch (err) {
        console.error('Error fetching user settings:', err);
        res.status(500).json({
            error: 'arcane.errors.server_error',
            error_details: 'Error fetching user settings.'
        });
    }
});

module.exports = app;
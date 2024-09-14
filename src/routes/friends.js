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

app.delete('/friends/api/v1/:accountId/friends/:friendAccountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.post('/friends/api/v1/:accountId/blocklist/:blockAccountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/friends/api/v1/:accountId/blocklist', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.delete('/friends/api/v1/:accountId/blocklist/:blockAccountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/friends/api/v1/:accountId/recent/:game', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

module.exports = app;
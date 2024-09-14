const express = require("express");

const app = express();

app.get('/party/api/v1/Fortnite/user/:accountId', (req, res) => {
    const { accountId } = req.params;
    res.json({
        partyId: accountId,
        partyMembers: [],
        leaderId: accountId
    })
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
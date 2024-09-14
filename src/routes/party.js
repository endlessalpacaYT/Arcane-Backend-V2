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

module.exports = app;
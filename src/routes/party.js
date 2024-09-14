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

module.exports = app;
const express = require("express");

const app = express();

app.get("/friends/api/v1/:accountId/blocklist", (req, res) => {
    const { backend } = req.params;

    const blocklist = [];

    const response = {
        backend: backend,
        blocklist: blocklist, 
        total: blocklist.length
    };

    res.status(200).json(response);
});

app.get('/friends/api/v1/:accountId/summary', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/friends/api/v1/:accountId/recent/fortnite', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

app.get('/friends/api/v1/:accountId/settings', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

module.exports = app;
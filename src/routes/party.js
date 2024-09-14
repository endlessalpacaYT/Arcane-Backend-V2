const express = require("express");

const app = express();

app.get('/party/api/v1/Fortnite/user/:accountId', (req, res) => {
    res.status(200).send({ message: 'OK' });
})

module.exports = app;
const express = require("express");

const app = express();

const functions = require("../utils/functions.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function generateServerTime() {
    return new Date().toISOString();
}

app.post('/datarouter/api/v1/public/data', (req, res) => {
    console.log('Data collection endpoint hit');
    res.status(204).end();
});

module.exports = app;

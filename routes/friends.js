const express = require("express");

const app = express();

app.get("/friends/api/v1/:backend/blocklist", (req, res) => {
    const { backend } = req.params;

    const blocklist = [];

    const response = {
        backend: backend,
        blocklist: blocklist, 
        total: blocklist.length
    };

    res.status(200).json(response);
});

module.exports = app;
const express = require("express");

const app = express();

app.use((req, res, next) => {
    res.status(404);
    res.json({
        error: "errors.common.arcane.notfound",
        status: 404
    })
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something went wrong!",
        Details: "500, Server Error: " + err,
        status: 500
    });
});

module.exports = app;
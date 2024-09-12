const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/user.js'); 

const app = express();
const global = { clientTokens: [] }; 

app.use(express.urlencoded({ extended: true }));

function DateAddHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

app.post('/account/api/oauth/token', async (req, res) => {
    try {
        console.log("Headers: ", req.headers); 
        console.log("Body: ", req.body);

        const { grant_type, username, password } = req.body;
    
        return res.status(400).json({
            error: "arcane.errors.login.invalid_grant_type"
        });
    } catch (err) {
        console.error('Error:', err);
        if (!res.headersSent) {
            return res.status(500).json({
                error: "arcane.errors.server_error",
                message: err.message
            });
        }
    }
});

module.exports = app;
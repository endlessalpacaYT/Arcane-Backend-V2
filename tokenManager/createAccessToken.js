const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
};

module.exports = createAccessToken;

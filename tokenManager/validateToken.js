const jwt = require('jsonwebtoken');

const validateToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = validateToken;
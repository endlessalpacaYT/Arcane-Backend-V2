const jwt = require('jsonwebtoken');

const createClientAccessToken = (clientId) => {
    return jwt.sign(
        {
            client_id: clientId,
            client_service: 'prod-fn',
            aud: 'fortnite-service',
            iss: 'arcane-backend',
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' } 
    );
};

module.exports = createClientAccessToken;

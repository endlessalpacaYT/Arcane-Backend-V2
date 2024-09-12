const generateExpiresAt = (expiresIn) => {
    return new Date(Date.now() + expiresIn * 1000).toISOString();
};

module.exports = generateExpiresAt;

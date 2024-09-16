const jwt = require('jsonwebtoken');
const Token = require('./Models/token');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; 

    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const storedToken = await Token.findOne({ token });

        if (!storedToken) {
            return res.status(401).json({ error: "Token not found or already invalidated" });
        }

        if (Date.now() > storedToken.expiresAt) {
            await Token.deleteOne({ token });
            return res.status(401).json({ error: "Token expired" });
        }

        req.user = decoded.user;
        next();

    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;

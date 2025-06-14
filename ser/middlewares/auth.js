const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
        status: 'error',
        error: 'Authentication failed! Please login',
        });
    }
    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
        status: 'error',
        error: 'Authentication failed! Please login',
        });
    }
};

module.exports = authenticateUser;
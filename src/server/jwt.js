const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const decoded = getAuth(req);
    if (!!decoded) {
        req.userId = decoded;
        next();
    } else {
        res.json({ error: 'Please log in.' });
    }
};

const getAuth = (req) => {
    if (!req.cookies || !req.cookies.accessToken) return null;
    try {
        return jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { isAuthenticated, getAuth };
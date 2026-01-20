const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret_key_change_me'
        );

        req.user = decoded; // { userId, orgId, role, ... }
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;

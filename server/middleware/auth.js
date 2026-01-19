const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    const MOCK_USER = {
        id: 'demo-123',
        name: "Demo User",
        email: "demo@kiddoz.com",
        role: "admin"
    };

    if (!token) {
        // PERMISSIVE FOR DEMO: Allow access without token
        req.user = MOCK_USER;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded;
        next();
    } catch (ex) {
        // PERMISSIVE FOR DEMO: If token is invalid, still allow as mock user
        req.user = MOCK_USER;
        next();
    }
};

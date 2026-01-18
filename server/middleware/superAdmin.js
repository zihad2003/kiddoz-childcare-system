module.exports = (req, res, next) => {
    // Check if user exists and has superadmin role
    // Note: auth middleware runs before this, so req.user should be present
    if (!req.user) {
        return res.status(401).json({ message: 'Access denied. User not authenticated.' });
    }

    // Check for superadmin role. 
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
    }

    next();
};

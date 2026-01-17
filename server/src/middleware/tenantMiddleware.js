module.exports = (req, res, next) => {
    if (!req.user || !req.user.tenantId) {
        return res.status(403).json({ error: 'Tenant context missing' });
    }

    req.tenantId = req.user.tenantId;

    next();
};

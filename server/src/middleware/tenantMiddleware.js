// This middleware ensures that queries are scoped to the tenant
// It assumes req.user is already populated by authMiddleware

module.exports = (req, res, next) => {
    if (!req.user || !req.user.tenantId) {
        return res.status(403).json({ error: 'Tenant context missing' });
    }

    // Helper to attach tenantId to queries (conceptually)
    // In a real app, you might use a library or AsyncLocalStorage to handle this globally.
    // For this prototype, we just ensure it's available on req for controllers to use.
    req.tenantId = req.user.tenantId;

    next();
};

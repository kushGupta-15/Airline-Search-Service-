const verifyServiceToken = (req, res, next) => {
    const expectedToken = process.env.INTERNAL_SERVICE_KEY || 'airline-internal-secret';
    const serviceToken = req.headers['x-service-token'];

    if (!serviceToken || serviceToken !== expectedToken) {
        return res.status(403).json({
            data: {},
            success: false,
            message: 'Forbidden: Invalid or missing internal service token',
            err: 'Unauthorized inter-service access attempt'
        });
    }
    next();
};

module.exports = {
    verifyServiceToken
};

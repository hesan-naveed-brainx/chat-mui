const jwt = require('jsonwebtoken');
const responseHelper = require('../utilities/responseHelper');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    // const token = req.header('Authorization');
    
    if (!token) {
        return responseHelper.errorResponse(
            res,
            'Access denied: No Access token Provided',
            {},
            401
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return responseHelper.errorResponse(
            res,
            'Access denied: Invalid token',
            {},
            401
        );
    }
};

module.exports = authMiddleware;
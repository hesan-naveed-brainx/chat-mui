module.exports = {
    successResponse: (res, message, data = {}, statusCode = 200) => {
        res.status(statusCode).json({
            status: "success",
            message: message,
            data: data
        });
    },
    errorResponse: (res, message, error = {}, statusCode = 500) => {
        res.status(statusCode).json({
            status: "error",
            message: message,
            error: error
        });
    }
}
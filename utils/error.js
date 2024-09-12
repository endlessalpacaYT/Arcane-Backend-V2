const express = require("express");

const app = express();

function createError(code, message, details, errorCode, errorType, statusCode, res) {
    res.status(statusCode).json({
        error: {
            code,
            message,
            details,
            errorCode,
            errorType
        }
    });
}

module.exports = {
    createError
};
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

class CustomError extends Error {
    constructor(code, message, details, errorCode, data, statusCode) {
        super(message);
        this.code = code;
        this.details = details || "No further details provided.";
        this.errorCode = errorCode || 1000;
        this.data = data || null;
        this.statusCode = statusCode || 500;
    }
}

function LetsError(code, message, details, errorCode, data, statusCode, res) {
    const errorResponse = {
        error: {
            code: code || "errors.com.epicgames.common.error",
            message: message || "An error occurred",
            details: details || "No additional information",
            errorCode: errorCode || 1000,
            data: data || null
        },
        status: statusCode || 500
    };

    console.error(`[${new Date().toISOString()}] ERROR ${statusCode}: ${message} - ${details}`);

    return res.status(statusCode || 500).json(errorResponse);
}

module.exports = {
    CustomError,
    createError,
    LetsError 
};

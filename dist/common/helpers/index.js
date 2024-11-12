"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.validateEmail = void 0;
const validateEmail = (email) => {
    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // Check if email is not empty and matches regex pattern
    if (!email || typeof email !== "string") {
        return false;
    }
    // Check maximum length (most email servers limit to 254 chars)
    if (email.length > 254) {
        return false;
    }
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;

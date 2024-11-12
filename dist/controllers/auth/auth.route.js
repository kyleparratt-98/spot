"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const helpers_1 = require("../../common/helpers");
const router = (0, express_1.Router)();
/**
 * Auth Routes
 *
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login - Login a user
 *
 * Routes are called by Captive Portal to manage user authentication:
 * - Register: Called when a new user registers on the captive portal
 * - Login: Called when a user attempts to login to the captive portal
 */
router.post("/api/auth/register", (0, helpers_1.asyncHandler)(auth_controller_1.default.register));
router.post("/api/auth/login", (0, helpers_1.asyncHandler)(auth_controller_1.default.login));
exports.default = router;

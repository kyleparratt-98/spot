"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = __importDefault(require("./session.controller"));
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const helpers_1 = require("../../common/helpers");
const router = (0, express_1.Router)();
/**
 * Session Routes
 *
 * GET /api/session/verify - Verify current session status
 * POST /api/session/update - Update session with usage data
 * DELETE /api/session/end - End an active session
 *
 * Routes are called by RADIUS SERVER to manage user sessions:
 * - Verify: Called during session start to validate user and get usage limits
 * - Update: Called periodically to update session data usage metrics
 * - End: Called when user disconnects to close the session and save final usage
 *
 * All routes require API key authentication from the RADIUS server
 */
router.get("/api/session/verify", auth_middleware_1.radiusAuthGuard, (0, helpers_1.asyncHandler)(session_controller_1.default.verifySession));
router.post("/api/session/update", auth_middleware_1.radiusAuthGuard, (0, helpers_1.asyncHandler)(session_controller_1.default.updateSession));
router.delete("/api/session/end", auth_middleware_1.radiusAuthGuard, (0, helpers_1.asyncHandler)(session_controller_1.default.endSession));
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accounting_controller_1 = __importDefault(require("./accounting.controller"));
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const helpers_1 = require("../../common/helpers");
const router = (0, express_1.Router)();
/**
 * Session Routes
 *
 * GET /api/accounting - Get accounting data for a user
 *
 * All routes require access token authentication
 */
router.get("/api/accounting", auth_middleware_1.tokenAuthGuard, (0, helpers_1.asyncHandler)(accounting_controller_1.default.getAccounting));
exports.default = router;

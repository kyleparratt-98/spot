"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const router = (0, express_1.Router)();
// Auth routes
router.post("/api/auth/login", controller_1.default.login);
router.post("/api/auth/logout", controller_1.default.logout);
// Session routes
router.get("/api/session/verify", controller_1.default.verifySession);
router.post("/api/session/start", controller_1.default.startSession);
router.delete("/api/session/end", controller_1.default.endSession);
exports.default = router;

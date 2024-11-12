"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_index_1 = __importDefault(require("./auth/auth.index"));
const router = (0, express_1.Router)();
// Combine all controllers
router.use(auth_index_1.default);
exports.default = router;

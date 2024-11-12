"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAuthGuard = exports.radiusAuthGuard = void 0;
const errors_1 = require("../errors");
const radiusAuthGuard = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.NODE_ENV !== "development") {
            const key = req.headers["x-api-key"];
            const requestIP = req.ip;
            if (!key ||
                key !== process.env.RADIUS_API_KEY ||
                requestIP !== process.env.RADIUS_API_IP) {
                throw new errors_1.HttpException(401, "Unauthorized!");
            }
        }
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.radiusAuthGuard = radiusAuthGuard;
const tokenAuthGuard = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (token)
            throw new errors_1.HttpException(401, "Unauthorized!");
        // Decode JWT token
        const decodedToken = Buffer.from(token.split(".")[1], "base64").toString();
        req.user = JSON.parse(decodedToken);
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.tokenAuthGuard = tokenAuthGuard;

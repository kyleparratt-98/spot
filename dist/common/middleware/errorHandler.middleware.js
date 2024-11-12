"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const response_middleware_1 = require("./response.middleware");
const errorMiddleware = (error, req, res, _next) => {
    const status = error.status || 500;
    const message = `SpotNest ERROR -- [${req === null || req === void 0 ? void 0 : req.method}] ${req === null || req === void 0 ? void 0 : req.path} >> StatusCode: ${status}, Message: ${error.message}`;
    (0, response_middleware_1.appResponse)(res, status, { message });
};
exports.errorMiddleware = errorMiddleware;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appResponse = void 0;
const package_json_1 = __importDefault(require("../../../package.json"));
const responseObject = {
    api: package_json_1.default.name,
    version: package_json_1.default.version,
    result: {
        statusCode: null,
        data: null,
    },
};
const appResponse = (res, statusCode, responseData) => {
    responseObject.result.statusCode = statusCode;
    responseObject.result.data = responseData;
    res.status(statusCode).send(responseObject);
};
exports.appResponse = appResponse;

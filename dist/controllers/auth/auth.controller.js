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
exports.AuthController = void 0;
const index_1 = require("../../common/helpers/index");
const db_1 = require("../../datasources/db");
const supabase_1 = require("../../common/types/supabase");
const errors_1 = require("../../common/errors");
const response_middleware_1 = require("../../common/middleware/response.middleware");
const supabase_auth_1 = require("@/datasources/auth/supabase-auth");
class AuthController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { email, password } = req.body;
            if (!email || !password || !(0, index_1.validateEmail)(email))
                throw new errors_1.HttpException(400, !email || !password
                    ? "Email and password are required"
                    : "Invalid email");
            const { data, error } = yield this.authDataSource.signUp(email, password);
            if (error)
                throw new errors_1.HttpException(400, (error === null || error === void 0 ? void 0 : error.message) || "Failed to sign up");
            yield this.postgresDb.createUser({
                id: (_a = data.user) === null || _a === void 0 ? void 0 : _a.id,
                email: (_b = data.user) === null || _b === void 0 ? void 0 : _b.email,
            });
            (0, response_middleware_1.appResponse)(res, 201, { message: "User created successfully" });
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password || !(0, index_1.validateEmail)(email))
                throw new errors_1.HttpException(400, !email || !password
                    ? "Email and password are required"
                    : "Invalid email");
            const { error } = yield this.authDataSource.signIn(email, password);
            if (error) {
                let statusCode = 500;
                let message = (error === null || error === void 0 ? void 0 : error.message) || "Failed to login";
                if ((error === null || error === void 0 ? void 0 : error.code) === supabase_1.SupabaseErrorCodes.INVALID_CREDENTIALS) {
                    statusCode = 400;
                    message = supabase_1.SupabaseErrorCodes.INVALID_CREDENTIALS;
                }
                if ((error === null || error === void 0 ? void 0 : error.code) === supabase_1.SupabaseErrorCodes.WEAK_PASSWORD) {
                    statusCode = 400;
                    message = supabase_1.SupabaseErrorCodes.WEAK_PASSWORD;
                }
                if ((error === null || error === void 0 ? void 0 : error.code) === supabase_1.SupabaseErrorCodes.EMAIL_EXISTS) {
                    statusCode = 400;
                    message = supabase_1.SupabaseErrorCodes.EMAIL_EXISTS;
                }
                throw new errors_1.HttpException(statusCode, message, error);
            }
            (0, response_middleware_1.appResponse)(res, 200, { message: "Successfully logged in" });
        });
        this.postgresDb = new db_1.PostgresDb();
        this.authDataSource = new supabase_auth_1.SupabaseAuthDataSource();
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();

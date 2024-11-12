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
exports.SessionController = void 0;
const response_middleware_1 = require("../../common/middleware/response.middleware");
const errors_1 = require("../../common/errors");
const db_1 = require("../../datasources/db");
const supabase_auth_1 = require("../../datasources/auth/supabase-auth");
const __helper__1 = require("./__helper__");
class SessionController {
    constructor() {
        this.verifySession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const latestSession = {
                status: "active",
                time_remaining: 600,
                data_remaining: 500,
                requires_reauthentication: false,
                message: "Session is active. You have 10 minutes remaining.",
            };
            if (!latestSession)
                throw new errors_1.HttpException(404, "No session found for this user");
            const response = {
                status: latestSession.status,
                time_remaining: 600, // Time remaining in seconds (10 minutes)
                data_remaining: 500, // Data remaining in MB
                requires_reauthentication: false, // Indicates if reauthentication is needed
                message: "Session is active. You have 10 minutes remaining.",
            };
            (0, response_middleware_1.appResponse)(res, 200, response);
        });
        this.updateSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user_id, data_in, data_out, session_id, user_data_cap } = req.body;
            if (!user_id || !data_in || !data_out || !session_id)
                throw new errors_1.HttpException(400, "All fields are required");
            // Update session usage metrics for the session
            yield this.postgresDb.updateSessionUsage({
                id: session_id,
                data_in: data_in,
                data_out: data_out,
            });
            // Check if the user has exceeded their data usage limit
            const exceeded = yield (0, __helper__1.checkUserUsage)(user_id, user_data_cap, this.postgresDb);
            // If the user has exceeded their data usage limit, end the session
            if (exceeded) {
                yield this.endSession(req, res);
            }
            (0, response_middleware_1.appResponse)(res, 200, { message: "Session updated successfully" });
        });
        this.endSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { session_id, data_in, data_out, user_id } = req.body;
            if (!session_id || !user_id || !data_in || !data_out)
                throw new errors_1.HttpException(400, "All fields are required");
            // Update session status to expired
            yield this.postgresDb.updateSession({
                id: session_id,
                status: "expired",
                data_in: data_in,
                data_out: data_out,
            });
            // Sign out the user
            const { error } = yield this.authDataSource.signOut(user_id);
            if (error)
                throw new errors_1.HttpException(500, (error === null || error === void 0 ? void 0 : error.message) || "Failed to logout");
            (0, response_middleware_1.appResponse)(res, 200, { message: "Session ended successfully" });
        });
        this.postgresDb = new db_1.PostgresDb();
        this.authDataSource = new supabase_auth_1.SupabaseAuthDataSource();
    }
}
exports.SessionController = SessionController;
exports.default = new SessionController();

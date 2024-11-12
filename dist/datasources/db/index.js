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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDb = void 0;
const prisma_1 = __importDefault(require("../../common/config/prisma"));
const uuid_1 = require("uuid");
class PostgresDb {
    constructor() {
        this.prisma = prisma_1.default;
    }
    /**
     * Get accounting data for a location
     * @param location_id - Location ID
     * @param time_start - Start time
     * @param time_end - End time
     * @returns Accounting data
     */
    getAccounting(location_id, time_start, time_end) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.sessionDb.aggregate({
                where: {
                    location_id,
                    start_time: { gte: time_start },
                    end_time: { lte: time_end },
                },
                _count: {
                    user_id: true,
                },
                _sum: {
                    data_in: true,
                    data_out: true,
                },
            });
        });
    }
    /**
     * Create a new user
     * @param data - User data
     * @returns User
     */
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.userDb.create({
                data: {
                    id: data.id,
                    email: data.email,
                },
            });
        });
    }
    /**
     * Create a new session
     * @param data - Session data
     * @returns Session
     */
    createSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.sessionDb.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    user_id: data.user_id,
                    location_id: data.location_id,
                    mac_address: data.mac_address,
                    ip_address: data.ip_address,
                },
            });
        });
    }
    /**
     * Get daily usage for a user
     * @param userId - User ID
     * @returns Daily usage
     */
    getDailyUsage(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.sessionDb.aggregate({
                where: {
                    user_id: userId,
                    start_time: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
                _sum: {
                    data_in: true,
                    data_out: true,
                },
            });
        });
    }
    /**
     * Update a session
     * @param data - Session data
     * @returns Session
     */
    updateSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.sessionDb.update({
                where: { id: data.id },
                data: data,
            });
        });
    }
    /**
     * Update a session usage
     * @param data - Session usage data
     * @returns Session
     */
    updateSessionUsage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.sessionDb.update({
                where: { id: data.id },
                data: {
                    data_in: { increment: data.data_in },
                    data_out: { increment: data.data_out },
                },
            });
        });
    }
}
exports.PostgresDb = PostgresDb;

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
exports.checkUserUsage = checkUserUsage;
/**
 * Check if the user has exceeded their daily data usage limit.
 * @param user_id - The ID of the user
 * @param session_id - The ID of the session
 * @param user_data_cap - The daily data usage limit for the user
 * @param postgresDb - The PostgresDb instance
 * @returns boolean
 */
function checkUserUsage(user_id, user_data_cap, postgresDb) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _sum } = yield postgresDb.getDailyUsage(user_id);
        const total_daily_usage = Number(_sum.data_in) + Number(_sum.data_out);
        if (total_daily_usage > user_data_cap) {
            return true;
        }
        return false;
    });
}

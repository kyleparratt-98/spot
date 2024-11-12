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
exports.accountingController = void 0;
const response_middleware_1 = require("@/common/middleware/response.middleware");
const db_1 = require("../../datasources/db");
class accountingController {
    constructor() {
        this.getAccounting = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { location_id, time_start, time_end } = req.query;
            const accountingData = yield this.postgresDb.getAccounting(location_id, new Date(time_start), new Date(time_end));
            (0, response_middleware_1.appResponse)(res, 200, {
                total_users: accountingData._count.user_id,
                total_data_in: accountingData._sum.data_in,
                total_data_out: accountingData._sum.data_out,
                total_data: Number(accountingData._sum.data_in || 0) +
                    Number(accountingData._sum.data_out || 0),
            });
        });
        this.postgresDb = new db_1.PostgresDb();
    }
}
exports.accountingController = accountingController;
exports.default = new accountingController();

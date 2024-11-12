import { appResponse } from "../../common/middleware/response.middleware";
import { AuthenticatedRequest } from "../../common/middleware/auth.middleware";
import { PostgresDb } from "../../datasources/db";
import { Response } from "express";
import { HttpException } from "../../common/errors";

export class accountingController {
  private postgresDb: PostgresDb;

  constructor() {
    this.postgresDb = new PostgresDb();
  }

  public getAccounting = async (req: AuthenticatedRequest, res: Response) => {
    const { location_id, time_start, time_end } = req.query;

    if (!location_id || !time_start || !time_end) {
      throw new HttpException(400, "Missing required query parameters");
    }

    const accountingData = await this.postgresDb.getAccounting(
      location_id as string,
      new Date(time_start as string),
      new Date(time_end as string)
    );

    appResponse(res, 200, {
      total_users: accountingData.unique_users,
      total_data_in: Number(accountingData._sum.data_in || 0),
      total_data_out: Number(accountingData._sum.data_out || 0),
      total_data:
        Number(accountingData._sum.data_in || 0) +
        Number(accountingData._sum.data_out || 0),
    });
  };
}

export default new accountingController();

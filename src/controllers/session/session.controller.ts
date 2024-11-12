import { appResponse } from "../../common/middleware/response.middleware";
import { HttpException } from "../../common/errors";
import { PostgresDb } from "../../datasources/db";
import e, { Request, Response } from "express";
import { SupabaseAuthDataSource } from "../../datasources/auth/supabase-auth";
import { checkUserUsage } from "./__helper__";

export class SessionController {
  private postgresDb;
  private authDataSource;

  constructor() {
    this.postgresDb = new PostgresDb();
    this.authDataSource = new SupabaseAuthDataSource();
  }

  public verifySession = async (req: Request, res: Response) => {
    const latestSession = {
      status: "active",
      time_remaining: 600,
      data_remaining: 500,
      requires_reauthentication: false,
      message: "Session is active. You have 10 minutes remaining.",
    };

    if (!latestSession)
      throw new HttpException(404, "No session found for this user");

    const response = {
      status: latestSession.status,
      time_remaining: 600, // Time remaining in seconds (10 minutes)
      data_remaining: 500, // Data remaining in MB
      requires_reauthentication: false, // Indicates if reauthentication is needed
      message: "Session is active. You have 10 minutes remaining.",
    };

    appResponse(res, 200, response);
  };

  public updateSession = async (req: Request, res: Response) => {
    const { user_id, data_in, data_out, session_id, user_data_cap } = req.body;

    if (!user_id || !data_in || !data_out || !session_id)
      throw new HttpException(400, "All fields are required");

    // Update session usage metrics for the session
    await this.postgresDb.updateSessionUsage({
      id: session_id,
      data_in: data_in,
      data_out: data_out,
    });

    // Check if the user has exceeded their data usage limit
    const exceeded = await checkUserUsage(
      user_id,
      user_data_cap,
      this.postgresDb
    );

    // If the user has exceeded their data usage limit, end the session
    if (exceeded) {
      await this.endSession(req, res);
    }

    appResponse(res, 200, { message: "Session updated successfully" });
  };

  public endSession = async (req: Request, res: Response) => {
    const { session_id, data_in, data_out, user_id } = req.body;

    if (!session_id || !user_id || !data_in || !data_out)
      throw new HttpException(400, "All fields are required");

    // Update session status to expired
    await this.postgresDb.updateSession({
      id: session_id,
      status: "expired",
      data_in: data_in,
      data_out: data_out,
    });

    // Sign out the user
    const { error } = await this.authDataSource.signOut(user_id);

    if (error)
      throw new HttpException(500, error?.message || "Failed to logout");

    appResponse(res, 200, { message: "Session ended successfully" });
  };
}

export default new SessionController();

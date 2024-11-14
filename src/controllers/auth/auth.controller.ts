import { validateEmail } from "../../common/helpers/index";
import { Request, Response } from "express";
import { LoginRequest } from "../../common/types/index";
import { PostgresDb } from "../../datasources/db";
import { SupabaseErrorCodes } from "../../common/types/supabase";
import { HttpException } from "../../common/errors";
import { appResponse } from "../../common/middleware/response.middleware";
import { SupabaseAuthDataSource } from "../../datasources/auth/supabase-auth";

export class AuthController {
  private postgresDb;
  private authDataSource;

  constructor() {
    this.postgresDb = new PostgresDb();
    this.authDataSource = new SupabaseAuthDataSource();
  }

  public register = async (
    req: Request<{}, {}, LoginRequest>,
    res: Response
  ) => {
    const { email, password, role } = req.body;
    if (!email || !password || !validateEmail(email))
      throw new HttpException(
        400,
        !email || !password
          ? "Email and password are required"
          : "Invalid email"
      );

    const { data, error } = await this.authDataSource.signUp(
      email,
      password,
      role
    );
    if (error)
      throw new HttpException(400, error?.message || "Failed to sign up");

    await this.postgresDb.createUser({
      id: data.user?.id,
      email: data.user?.email,
      roles: [role],
    });

    await Promise.all([
      this.postgresDb.createRadCheckUser({
        username: data.user?.email!,
        password: password,
      }),
    ]);

    appResponse(res, 201, {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    });
  };

  public login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password || !validateEmail(email))
      throw new HttpException(
        400,
        !email || !password
          ? "Email and password are required"
          : "Invalid email"
      );

    const { data, error } = await this.authDataSource.signIn(email, password);
    if (error) {
      let statusCode = 500;
      let message = error?.message || "Failed to login";

      if (error?.code === SupabaseErrorCodes.INVALID_CREDENTIALS) {
        statusCode = 400;
        message = SupabaseErrorCodes.INVALID_CREDENTIALS;
      }
      if (error?.code === SupabaseErrorCodes.WEAK_PASSWORD) {
        statusCode = 400;
        message = SupabaseErrorCodes.WEAK_PASSWORD;
      }
      if (error?.code === SupabaseErrorCodes.EMAIL_EXISTS) {
        statusCode = 400;
        message = SupabaseErrorCodes.EMAIL_EXISTS;
      }

      throw new HttpException(statusCode, message, error);
    }

    appResponse(res, 200, {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    });
  };
}

export default new AuthController();

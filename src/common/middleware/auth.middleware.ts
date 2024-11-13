import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors";
import { User } from "@supabase/supabase-js";
import { stdout } from "process";

export interface AuthenticatedRequest extends Request {
  user: User;
  token: string;
}

export const radiusAuthGuard = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (process.env.NODE_ENV !== "development") {
      const key = req.headers["x-api-key"];
      const requestIP = req.ip;
      console.log("key: ", key);
      console.log("requestIP: ", requestIP);

      if (
        !key ||
        key !== process.env.RADIUS_API_KEY ||
        requestIP !== process.env.RADIUS_API_IP
      ) {
        throw new HttpException(401, "Unauthorized!");
      }
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export const tokenAuthGuard = async (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (process.env.NODE_ENV !== "development") {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) throw new HttpException(401, "Unauthorized!");

      // Decode JWT token
      const decodedToken = Buffer.from(
        token!.split(".")[1],
        "base64"
      ).toString();

      const user = JSON.parse(decodedToken);

      // Check if token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (!user.exp || user.exp < currentTimestamp) {
        throw new HttpException(401, "Unauthorized!");
      }

      req.user = user;
    }
    return next();
  } catch (error) {
    next(error);
  }
};

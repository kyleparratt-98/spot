import { NextFunction, Request, Response } from "express";
import { appResponse } from "./response.middleware";
import { HttpException } from "../errors";

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = error.status || 500;
  const message = `SpotNest ERROR -- [${req?.method}] ${req?.path} >> StatusCode: ${status}, Message: ${error.message}`;

  appResponse(res, status, { message });
};

export { errorMiddleware };

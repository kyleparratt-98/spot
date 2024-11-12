/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { NextFunction, Response } from "express";
import packageJson from "../../../package.json";

const responseObject: ResponseObject = {
  api: packageJson.name,
  version: packageJson.version,
  result: {
    statusCode: null,
    data: null,
  },
};

export const appResponse = (
  res: Response,
  statusCode: number,
  responseData: any
): void => {
  responseObject.result.statusCode = statusCode;
  responseObject.result.data = responseData;
  res.status(statusCode).send(responseObject);
};

interface ResponseObject {
  api: string;
  version: string;
  result: {
    statusCode: number | null;
    data: any;
  };
}

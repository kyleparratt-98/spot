import { NextFunction, Request, RequestHandler, Response } from "express";

export const validateEmail = (email: string): boolean => {
  // RFC 5322 compliant email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Check if email is not empty and matches regex pattern
  if (!email || typeof email !== "string") {
    return false;
  }

  // Check maximum length (most email servers limit to 254 chars)
  if (email.length > 254) {
    return false;
  }

  return emailRegex.test(email);
};

export const asyncHandler =
  (fn: Function): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

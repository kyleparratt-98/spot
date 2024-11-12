import { Router } from "express";
import authController from "./auth.controller";
import { asyncHandler } from "../../common/helpers";

const router = Router();

/**
 * Auth Routes
 *
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login - Login a user
 *
 * Routes are called by Captive Portal to manage user authentication:
 * - Register: Called when a new user registers on the captive portal
 * - Login: Called when a user attempts to login to the captive portal
 */

router.post("/api/auth/register", asyncHandler(authController.register));
router.post("/api/auth/login", asyncHandler(authController.login));

export default router;

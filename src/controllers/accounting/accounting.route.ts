import { RequestHandler, Router } from "express";
import accountingController from "./accounting.controller";
import { tokenAuthGuard } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/helpers";

const router = Router();

/**
 * Session Routes
 *
 * GET /api/accounting - Get accounting data for a user
 *
 * All routes require access token authentication
 */

router.get(
  "/api/accounting",
  tokenAuthGuard as RequestHandler,
  asyncHandler(accountingController.getAccounting)
);

export default router;

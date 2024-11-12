import { RequestHandler, Router } from "express";
import sessionController from "./session.controller";
import { radiusAuthGuard } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/helpers";

const router = Router();

/**
 * Session Routes
 *
 * GET /api/session/verify - Verify current session status
 * POST /api/session/update - Update session with usage data
 * DELETE /api/session/end - End an active session
 *
 * Routes are called by RADIUS SERVER to manage user sessions:
 * - Verify: Called during session start to validate user and get usage limits
 * - Update: Called periodically to update session data usage metrics
 * - End: Called when user disconnects to close the session and save final usage
 *
 * All routes require API key authentication from the RADIUS server
 */

router.get(
  "/api/session/verify",
  radiusAuthGuard as RequestHandler,
  asyncHandler(sessionController.verifySession)
);
router.post(
  "/api/session/update",
  radiusAuthGuard as RequestHandler,
  asyncHandler(sessionController.updateSession)
);
router.delete(
  "/api/session/end",
  radiusAuthGuard as RequestHandler,
  asyncHandler(sessionController.endSession)
);

export default router;

import { Router } from "express";
import authController from "./auth/auth.index";
import accountingController from "./accounting/accounting.index";
import sessionController from "./session/session.index";

const router = Router();

// Combine all controllers
router.use(authController);
router.use(accountingController);
router.use(sessionController);

export default router;

import { Router } from "express";
import {
  sendRecoveryLink,
  resetPassword,
} from "../controllers/forgotPasswordController.js";

const router = Router();

router
  .post("/recoverAccount", sendRecoveryLink) // email to send link
  .post("/resetPassword", resetPassword);
export default router;

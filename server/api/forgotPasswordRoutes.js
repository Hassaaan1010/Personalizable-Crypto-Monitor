import { Router } from "express";
import { createNewPassword } from "../controllers/forgotPasswordController.js";

const router = Router();

router.post("/forgotPassword", createNewPassword); // email to send new password

export default router;

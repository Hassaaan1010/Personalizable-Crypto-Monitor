import { Router } from "express";
import { login, register } from "../controllers/authControllers.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router
  .post("/login", rateLimiter, login)
  .post("/register", rateLimiter, register);

export default router;

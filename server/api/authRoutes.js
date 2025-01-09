import { Router } from "express";
import { login, register } from "../controllers/authControllers.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router
  .post("/register", rateLimiter, register)
  .post("/login", rateLimiter, login);

export default router;

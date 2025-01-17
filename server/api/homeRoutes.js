import { Router } from "express";
import authorizeToken from "../middleware/jwtAuthorizer.js";
import rateLimiter from "../middleware/rateLimiter.js";
const router = Router();

router.get("/", rateLimiter, authorizeToken, (req, res) => {
  return res.status(200).json({ authorized: true });
});

export default router;

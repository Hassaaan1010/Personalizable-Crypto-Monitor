import { Router } from "express";
import authorizeToken from "../middleware/jwtAuthorizer.js";
import rateLimit from "express-rate-limit";
const router = Router();

router.get("/", rateLimit, authorizeToken, (req, res) => {
  return res.status(200).json({ authorized: true });
});

export default router;

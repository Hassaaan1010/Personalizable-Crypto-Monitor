import { Router } from "express";
import jwtAuthorizer from "../middleware/jwtAuthorizer.js";
const router = Router();

router.get("/", jwtAuthorizer, (req, res) => {
  return res.status(200).json({ authorized: true });
});

export default router;

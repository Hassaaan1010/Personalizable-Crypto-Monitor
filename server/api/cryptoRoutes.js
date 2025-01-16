// api/cryptoRoutes.js
import { Router } from "express";
import axios from "axios";
import {
  getTopCoins,
  getUsersCoins,
  getSearchResults,
  addCoin,
  removeCoin,
} from "../controllers/cryptoControllers.js";
// Middleware for rate limiting if needed
import rateLimiter from "../middleware/rateLimiter.js";
import authorizeToken from "../middleware/jwtAuthorizer.js";

const router = Router();

router.get("/topCoins", rateLimiter, getTopCoins);
router.get("/myCoins", rateLimiter, authorizeToken, getUsersCoins);
router.get("/search", rateLimiter, getSearchResults);
router.post("/addCoin", rateLimiter, authorizeToken, addCoin);
router.post("/removeCoin", rateLimiter, authorizeToken, removeCoin);

export default router;

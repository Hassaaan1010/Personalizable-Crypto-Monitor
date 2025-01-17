// api/cryptoRoutes.js
import { Router } from "express";
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

router
  .get("/topCoins", rateLimiter, getTopCoins)
  .get("/myCoins", rateLimiter, authorizeToken, getUsersCoins)
  .get("/search", rateLimiter, getSearchResults)
  .post("/addCoin", rateLimiter, authorizeToken, addCoin)
  .post("/removeCoin", rateLimiter, authorizeToken, removeCoin);

export default router;

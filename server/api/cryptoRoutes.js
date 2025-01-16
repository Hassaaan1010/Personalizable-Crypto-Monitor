// api/cryptoRoutes.js
import { Router } from "express";
import axios from "axios";
import {getTopCoins, getUsersCoins} from "../controllers/cryptoControllers.js"
// Middleware for rate limiting if needed
import rateLimiter from "../middleware/rateLimiter.js";
import authorizeToken from "../middleware/jwtAuthorizer.js"

const router = Router();

router.get("/topCoins",rateLimiter,  getTopCoins );
router.get("/myCoins",rateLimiter, getUsersCoins);

export default router;

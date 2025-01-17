import Router from "express";
import { createTrigger } from "../controllers/triggerController.js";
import authorizeToken from "../middleware/jwtAuthorizer.js";

const router = Router();

router.post("/createTrigger", authorizeToken, createTrigger); //a

export default router;

import Router from "express";
import { createTrigger } from "../controllers/triggerController.js";

const router = Router();

router.post("/createTrigger", createTrigger);

export default router;

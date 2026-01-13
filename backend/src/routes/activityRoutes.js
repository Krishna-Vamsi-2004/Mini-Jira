import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getRecentActivities } from "../controllers/activityController.js";

const router = express.Router();

// Get last 5 activities for logged-in user
router.get("/recent", authMiddleware, getRecentActivities);

export default router;

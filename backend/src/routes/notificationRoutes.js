import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

/**
 * GET NOTIFICATIONS
 * GET /api/notifications
 */
router.get("/", authMiddleware, getNotifications);

export default router;

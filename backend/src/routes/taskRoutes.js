import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createTask,
  getTasks,
  getArchivedTasks,
  editTask,
  updateTaskStatus,
  archiveTask,
  restoreTask,
} from "../controllers/taskController.js";

const router = express.Router();

/* ================= TASK ROUTES ================= */

// Create task
router.post("/", authMiddleware, createTask);

// Get active (non-archived) tasks
router.get("/", authMiddleware, getTasks);

// Get archived tasks
router.get("/archived", authMiddleware, getArchivedTasks);

// Edit task
router.patch("/:id", authMiddleware, editTask);

// Update task status (Kanban)
router.patch("/:id/status", authMiddleware, updateTaskStatus);

// Archive task
router.patch("/:id/archive", authMiddleware, archiveTask);

// Restore archived task
router.patch("/:id/restore", authMiddleware, restoreTask);

export default router;

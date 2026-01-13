import Task from "../models/Task.js";
import { logActivity } from "./activityController.js";

/**
 * CREATE TASK
 * POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user.id,
    });

    // ✅ ACTIVITY LOG
    await logActivity({
      userId: req.user.id,
      taskId: task._id,
      action: `Created task "${task.title}"`,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

/**
 * GET ALL TASKS (Logged-in user)
 * GET /api/tasks
 */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      archived: false,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/**
 * UPDATE TASK STATUS (Kanban)
 * PATCH /api/tasks/:id/status
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["todo", "inprogress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ ACTIVITY LOG
    await logActivity({
      userId: req.user.id,
      taskId: task._id,
      action: `Moved task "${task.title}" to ${status}`,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task status" });
  }
};

/**
 * EDIT TASK (Title, Description, Priority, Due Date)
 * PATCH /api/tasks/:id
 */
export const editTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title,
        description,
        priority,
        dueDate,
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ ACTIVITY LOG
    await logActivity({
      userId: req.user.id,
      taskId: task._id,
      action: `Edited task "${task.title}"`,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit task" });
  }
};

/**
 * RESTORE TASK
 * PATCH /api/tasks/:id/restore
 */
export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { archived: false },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ ACTIVITY LOG
    await logActivity({
      userId: req.user.id,
      taskId: task._id,
      action: `Restored task "${task.title}"`,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to restore task" });
  }
};

/**
 * GET ARCHIVED TASKS
 * GET /api/tasks/archived
 */
export const getArchivedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      archived: true,
    }).sort({ updatedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch archived tasks" });
  }
};

/**
 * ARCHIVE TASK (Soft Delete)
 * PATCH /api/tasks/:id/archive
 */
export const archiveTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { archived: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ ACTIVITY LOG
    await logActivity({
      userId: req.user.id,
      taskId: task._id,
      action: `Archived task "${task.title}"`,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to archive task" });
  }
};

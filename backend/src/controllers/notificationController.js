import ActivityLog from "../models/ActivityLog.js";
import Task from "../models/Task.js";
import { getDueStatus } from "../utils/dueDateUtils.js";

export const getNotifications = async (req, res) => {
  try {
    // 1️⃣ Recent activities
    const activities = await ActivityLog.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // 2️⃣ Due alerts
    const tasks = await Task.find({
      user: req.user.id,
      archived: false,
      status: { $ne: "done" },
      dueDate: { $exists: true },
    });

    const dueAlerts = tasks
      .map((task) => ({
        id: task._id,
        type: "due",
        title: task.title,
        dueStatus: getDueStatus(task.dueDate),
        createdAt: task.dueDate,
      }))
      .filter((t) => t.dueStatus);

    res.json({
      activities,
      dueAlerts,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

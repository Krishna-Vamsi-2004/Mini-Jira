import ActivityLog from "../models/ActivityLog.js";

/**
 * INTERNAL HELPER
 * Used by task controller to log actions
 */
export const logActivity = async ({ userId, taskId, action }) => {
  try {
    await ActivityLog.create({
      userId,
      taskId,
      action,
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};

/**
 * GET RECENT ACTIVITIES (for profile)
 * GET /api/activity/recent
 */
export const getRecentActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

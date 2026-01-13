import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    action: {
      type: String,
      required: true, 
      // examples: "Task Created", "Moved to Done", "Deleted"
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);

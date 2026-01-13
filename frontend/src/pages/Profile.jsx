import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import API from "../services/api.jsx";

const actionIcon = (action) => {
  if (action.includes("Created")) return "🆕";
  if (action.includes("Edited")) return "✏️";
  if (action.includes("Moved")) return "🔄";
  if (action.includes("Completed")) return "✅";
  if (action.includes("Archived")) return "🗂";
  if (action.includes("Restored")) return "♻️";
  return "📌";
};

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch REAL activity from backend
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await API.get("/activity/recent");
        setActivities(res.data);
      } catch (error) {
        console.error("Failed to load activity");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="min-h-screen bg-[#f2ecff] text-[#522987]">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* ===== PAGE HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold mb-2">
            Profile
          </h1>
          <p className="text-[#286ba2]">
            Your account information & activity
          </p>
        </motion.div>

        {/* ===== PROFILE CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            bg-white/70 backdrop-blur-xl
            border border-white/60
            rounded-2xl p-8
            shadow-[0_30px_100px_rgba(0,0,0,0.15)]
          "
        >
          {/* AVATAR + BASIC INFO */}
          <div className="flex items-center gap-6 mb-10">
            <div
              className="
                w-20 h-20 rounded-full
                bg-gradient-to-br from-[#2088fb] to-[#286ba2]
                flex items-center justify-center
                text-white text-3xl font-bold shadow-lg
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {user?.name || "User"}
              </h2>
              <p className="text-gray-500">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user?.name || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">Project User</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </div>

          {/* ===== ACTIVITY DROPDOWN ===== */}
          <div>
            <button
              onClick={() => setOpen(!open)}
              className="
                w-full flex items-center justify-between
                px-5 py-3 rounded-xl
                bg-[#e9f2ff] text-[#522987]
                font-semibold
                hover:bg-[#dbeafe] transition
              "
            >
              Recent Activity
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden mt-4"
                >
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-sm text-gray-500">
                        Loading activity...
                      </p>
                    ) : activities.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No recent activity yet.
                      </p>
                    ) : (
                      activities.map((activity) => (
                        <motion.div
                          key={activity._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="
                            flex items-start gap-4 p-4
                            bg-white rounded-xl
                            border border-slate-200
                            shadow-sm
                          "
                        >
                          <span className="text-xl">
                            {actionIcon(activity.action)}
                          </span>

                          <div>
                            <p className="text-sm font-medium">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

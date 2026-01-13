import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api.jsx";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    activities: [],
    dueAlerts: [],
  });
  const [loading, setLoading] = useState(false);

  // ===== FETCH NOTIFICATIONS =====
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const totalCount =
    notifications.activities.length +
    notifications.dueAlerts.length;

  return (
    <div className="relative">
      {/* ===== BELL BUTTON ===== */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-[#522987] hover:text-[#2088fb] transition"
      >
        <FiBell size={22} />

        {totalCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {totalCount}
          </span>
        )}
      </button>

      {/* ===== DROPDOWN ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 mt-4 w-80 z-50
              bg-white rounded-xl shadow-xl
              border border-slate-200 overflow-hidden
            "
          >
            <div className="px-4 py-3 border-b font-semibold text-[#522987]">
              Notifications
            </div>

            <div className="max-h-80 overflow-y-auto divide-y">
              {/* ===== DUE ALERTS ===== */}
              {notifications.dueAlerts.map((n) => (
                <div key={n.id} className="px-4 py-3 text-sm">
                  <p className="font-medium text-red-600">
                    ⚠ {n.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {n.dueStatus === "overdue"
                      ? "Overdue"
                      : "Due soon"}
                  </p>
                </div>
              ))}

              {/* ===== ACTIVITIES ===== */}
              {notifications.activities.map((a) => (
                <div
                  key={a._id}
                  className="px-4 py-3 text-sm text-gray-700"
                >
                  {a.action}
                </div>
              ))}

              {!loading &&
                totalCount === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    No notifications
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

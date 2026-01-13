import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.jsx";
import Header from "../components/Header";
import { Toaster, toast } from "react-hot-toast";
import { FiRotateCcw } from "react-icons/fi";

const ArchivedTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const fetchArchived = async () => {
      try {
        const res = await API.get("/tasks/archived");
        setTasks(res.data);
      } catch {
        toast.error("Failed to load archived tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchArchived();
  }, [navigate]);

  const restoreTask = async (id) => {
    try {
      await API.patch(`/tasks/${id}/restore`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task restored successfully");
    } catch {
      toast.error("Restore failed");
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2ecff] text-gray-600">
        Loading archived tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2ecff] text-gray-800">
      <Header />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#522987]">
              Archived Tasks
            </h1>
            <p className="text-gray-600">
              Restore tasks back to your workspace
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#2088fb] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#286ba2]"
          >
            Back to Dashboard
          </button>
        </div>

        <input
          placeholder="🔍 Search archived tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 bg-white border border-slate-300 px-4 py-2 rounded-lg"
        />

        {filteredTasks.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            No archived tasks
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-[#522987] line-clamp-1">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {task.description}
                  </p>
                )}

                {task.dueDate && (
                  <p className="text-xs text-gray-400 mt-3">
                    📅 Due: {task.dueDate.split("T")[0]}
                  </p>
                )}

                <button
                  onClick={() => restoreTask(task._id)}
                  className="mt-4 flex items-center gap-2 text-[#2088fb] hover:text-[#286ba2] font-medium"
                >
                  <FiRotateCcw />
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedTasks;

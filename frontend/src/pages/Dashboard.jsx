import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.jsx";
import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import KanbanBoard from "../components/KanbanBoard";
import { Toaster, toast } from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  // ===== CORE STATE =====
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== UI STATE =====
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // ===== FETCH TASKS =====
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [fetchTasks, navigate]);

  // ===== LOCAL STATE UPDATERS =====
  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  // ===== FILTER + SEARCH =====
  const filteredTasks = tasks.filter((task) => {
    const searchMatch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all" || task.status === statusFilter;

    const priorityMatch =
      priorityFilter === "all" || task.priority === priorityFilter;

    return searchMatch && statusMatch && priorityMatch;
  });

  // ===== ANALYTICS =====
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const pendingTasks = totalTasks - completedTasks;

  const today = new Date();
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < today && task.status !== "done";
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2ecff] text-gray-600">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2ecff] text-gray-800">
      <Header />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ===== TITLE ===== */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#522987]">
            Workspace
          </h1>
          <p className="text-gray-600">
            Manage tasks, priorities, and deadlines efficiently.
          </p>
        </div>

        {/* ===== ANALYTICS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {[
            ["Total Tasks", totalTasks, "text-[#522987]"],
            ["Completed", completedTasks, "text-green-600"],
            ["Pending", pendingTasks, "text-yellow-600"],
            ["Overdue", overdueTasks, "text-red-600"],
          ].map(([label, value, color], i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <h3 className={`text-3xl font-bold mt-2 ${color}`}>
                {value}
              </h3>
            </div>
          ))}
        </div>

        {/* ===== CREATE TASK ===== */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 bg-[#2088fb] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#286ba2]"
        >
          {showForm ? "Close Task Form" : "Create Task"}
        </button>

        {showForm && (
          <div className="mb-12">
            <TaskForm
              refreshTasks={(newTask) => {
                setTasks((prev) => [newTask, ...prev]);
                toast.success("Task created successfully");
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* ===== FILTERS + ARCHIVED BUTTON ===== */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <input
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-slate-300 px-4 py-2 rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 px-3 py-2 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-300 px-3 py-2 rounded-lg"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() => navigate("/archived")}
            className="bg-slate-200 text-[#522987] px-4 py-2 rounded-lg font-semibold hover:bg-slate-300"
          >
            Archived Tasks
          </button>
        </div>

        {/* ===== BOARD ===== */}
        <KanbanBoard
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onAction={(msg) => toast.success(msg)}
        />
      </div>
    </div>
  );
};

export default Dashboard;

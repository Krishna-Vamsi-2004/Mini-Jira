import { useState } from "react";
import API from "../services/api.jsx";

const TaskForm = ({ refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!dueDate || dueDate < today) {
      setError("Valid due date is required");
      return;
    }

    try {
      const res = await API.post("/tasks", {
        title,
        description,
        priority,
        dueDate,
      });

      // ✅ pass created task back
      refreshTasks(res.data);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch {
      setError("Failed to create task");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white border border-slate-300 rounded-xl p-6 space-y-5 shadow-sm"
    >
      {/* HEADER */}
      <h3 className="text-xl font-semibold text-[#522987]">
        Create New Task
      </h3>

      {/* ERROR */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full border border-slate-300 px-3 py-2 rounded text-[#522987] focus:outline-none focus:ring-2 focus:ring-[#2088fb]"
      />

      {/* DESCRIPTION */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={3}
        className="w-full border border-slate-300 px-3 py-2 rounded text-[#522987] focus:outline-none focus:ring-2 focus:ring-[#2088fb]"
      />

      {/* PRIORITY */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full border border-slate-300 px-3 py-2 rounded text-[#522987] focus:outline-none focus:ring-2 focus:ring-[#2088fb]"
      >
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      {/* DUE DATE */}
      <input
        type="date"
        min={today}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full border border-slate-300 px-3 py-2 rounded text-[#522987] focus:outline-none focus:ring-2 focus:ring-[#2088fb]"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-[#2088fb] text-white py-2 rounded-lg font-semibold hover:bg-[#286ba2] transition"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;

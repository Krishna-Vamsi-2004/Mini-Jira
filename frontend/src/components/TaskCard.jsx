import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import API from "../services/api.jsx";
import {
  FiEdit2,
  FiTrash2,
  FiRotateCcw,
  FiMove,
} from "react-icons/fi";

const TaskCard = ({
  task,
  onUpdate,
  onDelete,
  onAction,
  archivedView = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  /* ================= SORTABLE ================= */
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      sortable: {
        containerId: task.status, // required for cross-column DnD
      },
    },
    disabled: archivedView,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
  });

  const today = new Date();
  const due = task.dueDate ? new Date(task.dueDate) : null;

  const diffDays = due
    ? Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    : null;

  const isOverdue = diffDays !== null && diffDays < 0 && task.status !== "done";

  const priorityBorder = {
    high: "border-l-4 border-red-500",
    medium: "border-l-4 border-yellow-400",
    low: "border-l-4 border-green-500",
  };

  const isLongDescription =
    task.description && task.description.length > 120;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= EDIT ================= */
  const handleSave = async () => {
    try {
      const res = await API.patch(`/tasks/${task._id}`, formData);
      onUpdate(res.data);
      onAction("Task updated successfully");
      setIsEditing(false);
    } catch {
      onAction("Failed to update task");
    }
  };

  /* ================= ARCHIVE ================= */
  const handleArchive = async () => {
    try {
      await API.patch(`/tasks/${task._id}/archive`);
      onDelete(task._id);
      onAction("Task archived successfully");
    } catch {
      onAction("Failed to archive task");
    }
  };

  /* ================= RESTORE ================= */
  const handleRestore = async () => {
    try {
      await API.patch(`/tasks/${task._id}/restore`);
      onDelete(task._id);
      onAction("Task restored successfully");
    } catch {
      onAction("Failed to restore task");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-xl p-4 shadow-sm transition
        ${
          isOverdue
            ? "border-2 border-red-500 bg-red-50"
            : priorityBorder[task.priority]
        }
      `}
    >
      {/* ===== OVERDUE BADGE ===== */}
      {isOverdue && (
        <span className="inline-block mb-2 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded">
          OVERDUE
        </span>
      )}

      {/* ===== EDIT MODE ===== */}
      {isEditing ? (
        <div className="space-y-3">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-slate-300 px-2 py-1 rounded"
          />

          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-slate-300 px-2 py-1 rounded"
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border border-slate-300 px-2 py-1 rounded"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border border-slate-300 px-2 py-1 rounded"
          />

          <div className="flex justify-between text-sm">
            <button onClick={handleSave} className="text-green-600 font-medium">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ===== TITLE + DRAG HANDLE ===== */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold line-clamp-1" title={task.title}>
              {task.title}
            </h4>

            {!archivedView && (
              <span
                {...attributes}
                {...listeners}
                className="cursor-grab text-gray-400 hover:text-[#2088fb]"
                title="Drag task"
              >
                <FiMove />
              </span>
            )}
          </div>

          {/* ===== DESCRIPTION ===== */}
          {task.description && (
            <>
              <p
                className={`text-sm text-gray-500 mt-1 ${
                  expanded ? "" : "line-clamp-2"
                }`}
              >
                {task.description}
              </p>

              {isLongDescription && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs mt-1 text-[#2088fb]"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </>
          )}

          {/* ===== DUE DATE ===== */}
          {task.dueDate && (
            <p className="text-xs text-gray-500 mt-2">
              📅 Due: {task.dueDate.split("T")[0]}
            </p>
          )}

          {/* ===== ACTIONS ===== */}
          <div className="flex justify-end items-center mt-3">
            {!archivedView ? (
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[#522987] hover:text-[#2088fb]"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={handleArchive}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            ) : (
              <button
                onClick={handleRestore}
                className="flex items-center gap-2 text-green-600"
              >
                <FiRotateCcw />
                Restore
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;

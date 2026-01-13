import {
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import API from "../services/api.jsx";
import TaskCard from "./TaskCard";

/* ================= COLUMN ================= */

const KanbanColumn = ({ id, title, isActive, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const highlight = isOver || isActive;

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white rounded-xl p-4 shadow-sm
        transition-all duration-300 ease-out
        border-2
        ${
          highlight
            ? "border-[#2088fb] ring-4 ring-[#2088fb]/30 scale-[1.03]"
            : "border-slate-200"
        }
      `}
    >
      <h3 className="text-lg font-semibold text-[#522987] mb-4 text-center">
        {title}
      </h3>
      {children}
    </div>
  );
};

/* ================= BOARD ================= */

const KanbanBoard = ({
  tasks,
  onUpdate,
  onDelete,
  onAction,
  archivedView = false,
}) => {
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null); // ⭐ NEW

  const columns = archivedView
    ? { archived: "Archived Tasks" }
    : {
        todo: "To Do",
        inprogress: "In Progress",
        done: "Done",
      };

  /* ================= DRAG START ================= */
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task || null);
  };

  /* ================= DRAG OVER (HIGHLIGHT COLUMN) ================= */
  const handleDragOver = ({ over }) => {
    if (!over) {
      setActiveColumn(null);
      return;
    }

    const columnId =
      columns[over.id] ? over.id : over.data.current?.sortable?.containerId;

    setActiveColumn(columnId || null);
  };

  /* ================= DRAG END ================= */
  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const draggedTask = tasks.find((t) => t._id === active.id);
    if (!draggedTask) return;

    const targetStatus =
      columns[over.id] ? over.id : over.data.current?.sortable?.containerId;

    if (!targetStatus) return;
    if (draggedTask.status === targetStatus) return;

    try {
      const res = await API.patch(
        `/tasks/${draggedTask._id}/status`,
        { status: targetStatus }
      );

      onUpdate(res.data);
      onAction("Task moved successfully");
    } catch {
      onAction("Failed to move task");
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={archivedView ? undefined : handleDragStart}
      onDragOver={archivedView ? undefined : handleDragOver} // ⭐ NEW
      onDragEnd={archivedView ? undefined : handleDragEnd}
    >
      <div
        className={`grid gap-6 ${
          archivedView
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        {Object.entries(columns).map(([status, title]) => {
          const columnTasks = archivedView
            ? tasks
            : tasks.filter((t) => t.status === status);

          return (
            <KanbanColumn
              key={status}
              id={status}
              title={title}
              isActive={activeColumn === status} // ⭐ NEW
            >
              {!archivedView ? (
                <SortableContext
                  id={status}
                  items={columnTasks.map((t) => t._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onAction={onAction}
                        archivedView={false}
                      />
                    ))}

                    {columnTasks.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-6">
                        No tasks here
                      </p>
                    )}
                  </div>
                </SortableContext>
              ) : (
                <div className="space-y-4">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onAction={onAction}
                      archivedView
                    />
                  ))}
                </div>
              )}
            </KanbanColumn>
          );
        })}
      </div>

      {/* ================= SMOOTH DRAG PREVIEW ================= */}
      <DragOverlay>
        {activeTask ? (
          <div className="scale-105 rotate-2 shadow-2xl">
            <TaskCard task={activeTask} archivedView />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;

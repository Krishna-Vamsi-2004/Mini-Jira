/**
 * Normalize date to avoid timezone issues
 */
const normalize = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Check if a task is overdue
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;

  const today = normalize(new Date());
  const due = normalize(dueDate);

  return due < today;
};

/**
 * Check if task is due soon (within X days)
 */
export const isDueSoon = (dueDate, days = 1) => {
  if (!dueDate) return false;

  const today = normalize(new Date());
  const due = normalize(dueDate);

  const diffDays =
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays > 0 && diffDays <= days;
};

/**
 * 🔔 Get human-readable due status
 * Used by notification system
 */
export const getDueStatus = (dueDate) => {
  if (!dueDate) return null;

  if (isOverdue(dueDate)) {
    return "overdue";
  }

  if (isDueSoon(dueDate, 1)) {
    return "due-today";
  }

  if (isDueSoon(dueDate, 3)) {
    return "due-soon";
  }

  return null;
};

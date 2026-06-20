import {
  insertTask,
  getTasksByUser,
  getTaskByIdAndUser,
  updateTask,
  deleteTask,
  searchTasksByKeyword
} from '../repositories/taskRepository.js';
import { isEmpty, isValidDate, isValidPriority, isValidStatus } from '../utils/validators.js';

export async function addTask(userId, title, description, dueDate, priority) {
  if (isEmpty(title)) {
    return { success: false, message: 'Task title cannot be empty.' };
  }
  if (!isValidDate(dueDate)) {
    return { success: false, message: 'Invalid date format.' };
  }
  if (!isValidPriority(priority)) {
    return { success: false, message: 'Priority must be Low, Medium, or High.' };
  }

  const id = await insertTask(userId, title, description, dueDate, priority);
  return { success: true, message: 'Task added successfully!', taskId: id };
}

export async function getAllTasks(userId) {
  const tasks = await getTasksByUser(userId);
  return { success: true, tasks };
}

export async function editTask(userId, taskId, newValues) {
  const existing = await getTaskByIdAndUser(taskId, userId);
  if (!existing) {
    return { success: false, message: 'Task not found.' };
  }

  // Empty input on a field means "keep the current value" — see README for why.
  const title = isEmpty(newValues.title) ? existing.title : newValues.title;
  const description = isEmpty(newValues.description) ? existing.description : newValues.description;
  const dueDate = isEmpty(newValues.dueDate) ? formatDateForCompare(existing.dueDate) : newValues.dueDate;
  const priority = isEmpty(newValues.priority) ? existing.priority : newValues.priority;
  const status = isEmpty(newValues.status) ? existing.status : newValues.status;

  if (!isValidDate(dueDate)) {
    return { success: false, message: 'Invalid date format.' };
  }
  if (!isValidPriority(priority)) {
    return { success: false, message: 'Invalid priority.' };
  }
  if (!isValidStatus(status)) {
    return { success: false, message: 'Status must be Pending or Completed.' };
  }
  await updateTask(taskId, userId, {
    title,
    description,
    dueDate,
    priority,
    status
  });

  return { success: true, message: 'Task updated successfully!' };
}

export async function removeTask(userId, taskId, confirmed) {
  const existing = await getTaskByIdAndUser(taskId, userId);
  if (!existing) {
    return { success: false, message: 'Task not found.' };
  }
  if (!confirmed) {
    return { success: false, message: 'Delete cancelled.' };
  }

  await deleteTask(taskId, userId);
  return { success: true, message: 'Task deleted successfully!' };
}

export async function search(userId, keyword) {
  const tasks = await searchTasksByKeyword(userId, keyword);
  return { success: true, tasks };
}

function formatDateForCompare(d) {
  if (!d) return '';
  return new Date(d).toISOString().split('T')[0];
}

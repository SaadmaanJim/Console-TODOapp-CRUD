import pool from '../config/db.js';

export async function insertTask(userId, title, description, dueDate, priority) {
  const [result] = await pool.execute(
    `INSERT INTO Task (userId, title, description, dueDate, priority, status)
     VALUES (?, ?, ?, ?, ?, 'Pending')`,
    [userId, title, description, dueDate, priority]
  );
  return result.insertId;
}

export async function getTasksByUser(userId) {
  const [rows] = await pool.execute(
    'SELECT * FROM Task WHERE userId = ? ORDER BY id',
    [userId]
  );
  return rows;
}

export async function getTaskByIdAndUser(id, userId) {
  const [rows] = await pool.execute(
    'SELECT * FROM Task WHERE id = ? AND userId = ?',
    [id, userId]
  );
  return rows[0] || null;
}

export async function updateTask(id, userId, fields) {
  const { title, description, dueDate, priority, status } = fields;
  await pool.execute(
    `UPDATE Task
     SET title = ?, description = ?, dueDate = ?, priority = ?, status = ?
     WHERE id = ? AND userId = ?`,
    [title, description, dueDate, priority, status, id, userId]
  );
}

export async function deleteTask(id, userId) {
  await pool.execute(
    'DELETE FROM Task WHERE id = ? AND userId = ?',
    [id, userId]
  );
}

export async function searchTasksByKeyword(userId, keyword) {
  const likeKeyword = `%${keyword}%`;
  const [rows] = await pool.execute(
    'SELECT * FROM Task WHERE userId = ? AND (title LIKE ? OR description LIKE ?)',
    [userId, likeKeyword, likeKeyword]
  );
  return rows;
}

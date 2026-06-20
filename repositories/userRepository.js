import pool from '../config/db.js';

export async function createUser(name, email, hashedPassword) {
  const [result] = await pool.execute(
    'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return result.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM User WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM User WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

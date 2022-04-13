import pool from '../database/db.js'

const getAllUsers = async () => {
  const users = await pool.query('SELECT * FROM users ORDER BY id ASC')
  return users.rows
}

const getUserRowCountByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  return result.rowCount !== 0
}

const getUserByEmail = async (email) => {
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  return user.rows[0]
}

const addUser = async (user) => {
  const result = await pool.query('INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)',
    [user.id, user.name, user.email, user.password])
  return result.rows
}

export {
  getAllUsers,
  getUserByEmail,
  getUserRowCountByEmail,
  addUser
}

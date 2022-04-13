import pool from '../database/db.js'

const addPlace = async (place) => {
  const result = await pool.query('INSERT INTO places (id, title, description, address, location, creator) VALUES ($1, $2, $3, $4, $5, $6)',
    [place.id, place.title, place.description, place.address, place.location, place.creator])
  return result.rows
}

const findPlacesByUser = async (userId) => {
  const places = await pool.query('SELECT * FROM places WHERE creator=$1', [userId])
  return places.rows
}

const findPlaceById = async (placeId) => {
  const places = await pool.query('SELECT * FROM places WHERE id=$1', [placeId])
  return places.rows[0]
}

const updatePlaceWithId = async (placeId, title, description) => {
  const result = await pool.query('UPDATE places SET title=$1, description=$2 WHERE id=$3',
    [title, description, placeId])
  return result.rowCount !== 0
}

const deletePlaceWithId = async (placeId) => {
  const result = await pool.query('DELETE FROM places WHERE id=$1', [placeId])
  return result.rowCount !== 0
}

export {
  addPlace,
  deletePlaceWithId,
  findPlacesByUser,
  findPlaceById,
  updatePlaceWithId
}

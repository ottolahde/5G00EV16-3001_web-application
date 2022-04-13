import { v4 } from 'uuid'
import { validationResult } from 'express-validator'

import HttpError from '../models/http-error.js'
import {
  addPlace,
  deletePlaceWithId,
  findPlacesByUser,
  findPlaceById,
  updatePlaceWithId
} from '../models/places.js'

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid
  const place = await findPlaceById(placeId)

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404)
    return next(error)
  }

  res.json({ place })
}

const getPlacesByUserId = async (req, res, next) => {
  const placeCreator = req.params.uid
  const places = await findPlacesByUser(placeCreator)

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    )
  }

  res.json({ places })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid values given, please check the data', 422))
  }

  const { title, description, address, coordinates, creator } = req.body
  const newPlace = {
    id: v4(),
    title,
    description,
    address,
    location: coordinates,
    creator
  }

  const result = await addPlace(newPlace)
  if (!result) {
    return next(new HttpError('Something went wrong creating the user', 500))
  }
  res.status(201).json({ place: newPlace })
}

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid values given, please check the data', 422))
  }
  const { title, description } = req.body
  const placeId = req.params.pid

  const place = await findPlaceById(placeId)

  if (!place) {
    return next(new HttpError('Could not find a place for the provided id.', 404))
  }

  if (place.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to update the place.', 401))
  }

  const result = await updatePlaceWithId(placeId, title, description)
  console.log(result)
  if (!result) {
    return next(new HttpError('Could not update the details for the provided id.', 404))
  }
  place.title = title
  place.description = description

  res.status(200).json({ place: place })
}

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  const place = await findPlaceById(placeId)
  if (!place) {
    return next(new HttpError('Could not find a place for the provided id.', 404))
  }

  if (place.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to delete the place.', 401))
  }

  const result = await deletePlaceWithId(placeId)
  if (!result) {
    return next(new HttpError('Could not delete the place the provided id.', 404))
  }
  res.status(200).json({ message: 'Deleted the place.' })
}

export {
  createPlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlaceById,
  deletePlaceById
}

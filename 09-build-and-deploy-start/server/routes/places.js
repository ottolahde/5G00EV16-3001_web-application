import { Router } from 'express'
import { check } from 'express-validator'

import {
  createPlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlaceById,
  deletePlaceById
} from '../controllers/places.js'

import checkToken from '../middleware/verifyToken.js'

const placesRouter = Router()

placesRouter.get('/:pid', getPlaceById)

placesRouter.get('/user/:uid', getPlacesByUserId)

placesRouter.use(checkToken)

placesRouter.post(
  '/',
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').notEmpty()
  ],
  createPlace
)

placesRouter.patch(
  '/:pid',
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 })
  ],
  updatePlaceById
)

placesRouter.delete('/:pid', deletePlaceById)

export default placesRouter

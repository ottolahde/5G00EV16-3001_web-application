import { Router } from 'express'
import { check } from 'express-validator'

import { getUsers, signUpUser, loginUser } from '../controllers/users.js'

const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.post(
  '/signup',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  signUpUser
)

usersRouter.post('/login', loginUser)

export default usersRouter

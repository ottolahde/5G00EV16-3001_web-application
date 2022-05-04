import { validationResult } from 'express-validator'
import { v4 } from 'uuid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import HttpError from '../models/http-error.js'

import {
  addUser,
  getAllUsers,
  getUserByEmail,
  getUserRowCountByEmail
} from '../models/users.js'

const getUsers = async (req, res, next) => {
  const users = await getAllUsers()
  res.json({ users: users })
}

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid values given, please check the data', 422))
  }

  const { name, email, password } = req.body
  const exist = await getUserRowCountByEmail(email)
  if (exist) {
    return next(new HttpError('Could not create user, user exist', 422))
  }

  let hashedPassword
  try {
    // Parameters, the string to hash, salt length to generate or salt to use
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(HttpError(
      'Could not create user, try again', 500))
  }

  const newUser = {
    id: v4(),
    name,
    email,
    password: hashedPassword
  }

  const result = await addUser(newUser)
  if (!result) {
    return next(new HttpError('Something went wrong creating the user', 500))
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: newUser.id, // payload, anything that make sense and
        email: newUser.email // what you might need on the frontend
      },
      process.env.JWT_KEY, // secret key
      { expiresIn: '1h' } // options like an experation time
    )
  } catch (err) {
    return next(new HttpError('Signup failed, please try again', 500))
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token: token
  })
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  const identifiedUser = await getUserByEmail(email)

  if (!identifiedUser) {
    return next(new HttpError('Could not identify user, credetials might be wrong', 401))
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password)
  } catch (err) {
    return next(new HttpError('Could not log you in , check your credetials', 500))
  }

  if (!isValidPassword) {
    return next(new HttpError('Could not identify user, credetials might be wrong', 401))
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: identifiedUser.id, // payload, anything that make sense and
        email: identifiedUser.email // what you might need on the frontend
      },
      process.env.JWT_KEY, // secret key
      { expiresIn: '1h' } // options like an experation time
    )
  } catch (err) {
    return next(new HttpError('Login in failed, please try again', 500))
  }

  res.status(201).json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token
  })
}

export {
  getUsers,
  signUpUser,
  loginUser
}

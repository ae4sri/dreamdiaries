import jwt from 'jsonwebtoken'
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
import { Request, Response } from 'express'

loginRouter.post('/', async (req: Request, res: Response) => { // route to login user
  const body = req.body
  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null 
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) { 
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET!, { expiresIn: 21600 }) // Authentification token expires in 6 hours

  return res
    .status(200)
    .send({ token, username: user.username })
})

export default loginRouter
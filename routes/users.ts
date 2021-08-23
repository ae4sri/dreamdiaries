const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
import jwt from 'jsonwebtoken'

import { Request, Response } from 'express'

usersRouter.post('/', async (req: Request, res: Response) => { // route to create a user
  try {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      passwordHash,
    })
    const savedUser = await user.save()

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET!, { expiresIn: 21600 })

    res.json({ token, username: savedUser.username })
  } catch(e) {
    res.status(400).json(`error: ${e}`)
  }

})

// usersRouter.get('/', async (_req: Request, res: Response) => {
//   const users = await User.find({}).populate('diaryentries', 'title text') // This route was designed for testing
//   res.json(users)
// })



export default usersRouter
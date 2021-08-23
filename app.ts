import express from 'express'
const app = express()
import config from './utils/config'
import diariesRouter from './routes/diaries'
import mongoose from 'mongoose'
import { errorMiddleware, notFoundMiddleware } from "./utils/error";
import usersRouter from './routes/users'
import loginRouter from './routes/login'
import cors from 'cors'

const handleTokens = require('./utils/handleTokens')


mongoose.connect(config.MONGODB_URI || '', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


app.use(express.static('build'))

app.use(express.json())

app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong')
})

app.use(cors())

app.use(handleTokens.tokenExtractor)


app.use('/api/diaries', diariesRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use([notFoundMiddleware, errorMiddleware]);

export default app
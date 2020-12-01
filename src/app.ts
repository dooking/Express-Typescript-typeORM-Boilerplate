import express, { Request, Response, NextFunction } from 'express'
import logger from 'morgan'
import router from './router/index'
const app: express.Application = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)

app.listen(3000, () => {
  console.log('start')
})

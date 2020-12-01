import 'reflect-metadata'
import { createConnection, Connection } from 'typeorm'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import 'dotenv/config'

// Import Routers
import router from './router/index'
// Connect typeORM mysql
createConnection()
  .then(async (connection: Connection) =>
    console.log('Entity connected : ', connection.isConnected),
  )
  .catch((err: Error) => console.log('Entity connection error : ', err))

// Create express server
const app = express()

// middlewares
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(morgan('dev'))
app.use(
  cors({
    origin: [`${process.env.TEST_IP}`],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

// Routes
app.use('/', router)

app.listen(app.get('port'), () => {
  console.log('server listening at on port %d', app.get('port'))
})
export default app

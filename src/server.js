import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import yenv from 'yenv'
import mongoose from 'mongoose'
import routes from './routes'
import docs from './utils/api-docs'
import apiError from './utils/api-error'
import LogManager from './utils/logging/log-manager'

const env = yenv()
const server = new Koa()
const logManager = new LogManager()

server
  .use(json())
  .use(bodyParser())
  .use(logger())
  .use(apiError)
  .use(docs)

routes.map(item => {
  server
    .use(item.routes())
    .use(item.allowedMethods())
})

server.on('error', (err, ctx) => {
  console.error('logging error')
  const isOperationalError = logManager.error(err)
  // if (!isOperationalError) {
  // }
})

mongoose
  .connect(env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    server.listen(env.PORT, () => {
      console.log(`Listening on port: ${env.PORT}`)
    })
  })
  .catch(error => {
    console.error(error)
  })

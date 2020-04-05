import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import yenv from 'yenv'
import mongoose from 'mongoose'
import routes from './routes'
const env = yenv()
const server = new Koa()

server
  .use(json())
  .use(bodyParser())
  .use(logger())

routes.map(item => {
  server
    .use(item.routes())
    .use(item.allowedMethods())
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

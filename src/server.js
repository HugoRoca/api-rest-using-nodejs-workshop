const Koa = require('koa')
const json = require('koa-json')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const yenv = require('yenv')
const mongoose = require('mongoose')
const routes = require('./routes')
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

# api-rest-using-nodejs-workshop

## Summary
This repo tries to help understand how to build an REST API using node.js. It implements several scenarios through different branches. 

## Use cases
Each branch represents a step in the evolution of entire final project.

### List of Branches
- **part-1**: The simplest case, an basic api rest demo with pure javascript (no babel, no typescript), but using linter eslint.
- **part-2**: Implementing the code using babel
- **part-3**: It's time to validate http request from body and path params
- **part-4**: Documenting our API with open api (swagger)
- **part-5**: Improve error handling and logging
- **part-6**: Add unit testing
- **part-7**: Secure our API
- **part-8**: Improving our API with other configurations

## Projects folder structures
All projects contains similar folders structure such as:
- /src
  - /controllers
  - /models
  - /routes
  - /schemas
  - /repositories
  - /middlewares
  - /utils

## Implementations Steps
0. About the Database
In this workshop I use Mongodb
it's important to note that the mongodb database is no part from this codebase. 
you must run mongodb in the way you want, either docker, local or as in my case I use a free tier of mongo atlas.
Im my case i use the following configuration:
database name: contacts
collection name: people
structure example of people collection:
```json
{
	"_id" : "5dc880911d8f228138671d91",
	"index" : 999,
	"age" : 27,
	"eyeColor" : "blue",
	"name" : "Daphne Phillips",
	"gender" : "female",
	"company" : "KIGGLE",
	"country" : "CL",
	"email" : "daphnephillips@kiggle.com",
	"phone" : "+1 (951) 478-3448",
	"address" : "654 Benson Avenue, Healy, California, 1589"
}
```
I recommend you create a free cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). It's very easy.

1. create project folder
2. initialize node project
```shell
npm init -y
```
3. Install dependencies
```shell
npm i koa koa-router koa-bodyparser koa-logger koa-json mongoose yenv cross-env
```
4. Install DEV dependencies
```shell
npm i -D nodemon eslint
```
5. Initialize linter
```shell
npx eslint --init
```
6. Open project folder with your editor
7. Create src folder
8. Edit package.json and add scripts
```json
"dev": "cross-env NODE_ENV=stage nodemon ./src/server.js",
"start": "cross-env NODE_ENV=production node ./src/server.js",
"lint": "eslint src -f stylish",
```
9. Create env.yaml in root folder with de following text
```yaml
development:
    PORT: 3000,
    MONGODB_URL: "mongodb+srv://your-user-here:your-password-here@your-cluster-url/your-database-here?retryWrites=true&w=majority"
production:
    PORT: 3000,
    MONGODB_URL: "mongodb+srv://your-user-here:your-password-here@your-cluster-url/your-database-here?retryWrites=true&w=majority"
```
Note: replace the url template with your values (your-user-here, your-password-here, your-cluster-url, your-database-here)
add env.yaml to .gitignore (for security reasons)

10. Models
  * Create src/models folder
  * Create **person.model.js** wuth the following code:
  ```javascript
// person.model.js
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  index: Number,
  age: Number,
  eyeColor: String,
  name: String,
  gender: String,
  company: String,
  country: String,
  email: String,
  phone: String,
  address: String
}, {
  collection: 'people'
})

const PersonModel = mongoose.model('PersonModel', schema)

module.exports = PersonModel
```

11. Repositories
  * Create src/repositories folder
  * Create **person.repository.js**
```javascript
// person.repository.js
const personModel = require('../models/person.model')
module.exports = class PersonRepository {
  async find (filter) {
    return await personModel.findOne(filter)
  }
}
```

12. Controlleres
  * Create src/controllers folder
  * Create **person.controller.js**
```javascript
// person.controller.js
const PersonRepository = require('../repositories/person.repository')
const repository = new PersonRepository()

module.exports = class PersonController {
  async getByIndex (ctx) {
    const index = ctx.params.index && !isNaN(ctx.params.index) ? parseInt(ctx.params.index) : 0
    if (index > 0) {
      const filter = { index: index }
      const data = await repository.find(filter)
      if (data) {
        ctx.body = data
      } else {
        ctx.throw(404, `There is no person with index number: ${index}`)
      }
    } else {
      ctx.throw(422, `Unexpected value: ${ctx.params.index} is oncorrect`)
    }
  }
}
```

13. Router
  * Create src/routes folder
  * Create **person.route.js**
```javascript
// person.route.js
const KoaRouter = require('koa-router')
const PersonController = require('../controllers/person.controller')
const router = new KoaRouter({ prefix: '/person' })
const controller = new PersonController()

router.get('/person/byIndex', '/:index', controller.getByIndex)

module.exports = router
```
14. Create **src/routes.js**
```javascript
// routes.js
const personRouter = require('./routes/person.route')

module.exports = [personRouter]
```
15. Create **src/server.js**
```javascript
// server.js
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
```
16. It's time to test our code, from the terminal run:
```bash
npm run dev
```
and then from the browser or postman call localhost:3000/person/1

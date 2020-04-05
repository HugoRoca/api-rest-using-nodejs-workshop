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
npm i -D @babel/cli @babel/node @babel/core @babel/preset-env @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from rimraf babel-preset-minify eslint babel-eslint
```
5. create .babelrc.js file
```javascript
// .babelrc.js
const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: true,
      },
    },
  ],
  "minify",
]
const plugins = [
  "@babel/plugin-proposal-export-default-from",
  "@babel/plugin-proposal-export-namespace-from",
]
export default { presets, plugins }

```
5. Initialize linter
```shell
npx eslint --init
```
		- select To check syntax, find problems, and enforce code style
		- select JavaScript modules (import/export)
		- select None of these
		- Does your project use TypeScript?: N
		- Where does your code run? 
		- Use a popular style guide: Standart
		- What format do you want your config file to be in?: YAML
		- Would you like to install them now with npm?: Y
6. Edit **.eslintrc.yaml** and add: **parser: babel-eslint** 
```yaml
env:
  es6: true
  node: true
extends:
  - standard
globals:
  Atomics: readonly
  SharedArrayBuffer: readonly
parser: babel-eslint
parserOptions:
  ecmaVersion: 2018
  sourceType: module
rules: {}

```
7. add **.eslintignore** file in root folder (outside src) edit this file and add: **dist/**
8. Create src folder
9. Edit package.json and add scripts
```json
"dev": "cross-env NODE_ENV=stage nodemon --exec babel-node ./src/server.js",
"clean": "rimraf .cache dist reports tmp",
"prebuild": "npm run clean && npm run lint",
"build": "babel src --out-dir dist --copy-files && cp env.yaml ./dist",
"lint": "eslint src -f stylish",
"start": "cross-env NODE_ENV=stage node ./dist/server.js",
"start:prd": "cross-env NODE_ENV=production node ./dist/server.js",
```
10. Create env.yaml in root folder with de following text
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

11. Models
  * Create src/models folder
  * Create **person.model.js** wuth the following code:
  ```javascript
// person.model.js
import { Schema, model } from 'mongoose'

const schema = new Schema({
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

const PersonModel = model('PersonModel', schema)

export default PersonModel

```
12. Repositories
  * Create src/repositories folder
  * Create **person.repository.js**
```javascript
// person.repository.js
import PersonModel from '../models/person.model'

export default class PersonRepository {
  async find (filter) {
    return await PersonModel.findOne(filter)
  }
}

```

13. Controlleres
  * Create src/controllers folder
  * Create **person.controller.js**
```javascript
// person.controller.js
import PersonRepository from '../repositories/person.repository'
const repository = new PersonRepository()

export default class PersonController {
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

14. Router
  * Create src/routes folder
  * Create **person.route.js**
```javascript
// person.route.js
import KoaRouter from 'koa-router'
import PersonController from '../controllers/person.controller'
const router = new KoaRouter({ prefix: '/person' })
const controller = new PersonController()

router.get('/person/byIndex', '/:index', controller.getByIndex)

export default router

```
15. Create **src/routes.js**
```javascript
// routes.js
import personRouter from './routes/person.route'

export default [personRouter]

```
16. Create **src/server.js**
```javascript
// server.js
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

```
17. It's time to test our code, from the terminal run:
```shell
npm run dev
```
and then from the browser or postman call localhost:3000/person/1

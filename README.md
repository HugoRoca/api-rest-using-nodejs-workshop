# api-rest-using-nodejs-workshop

# This Branch is the Part 3 of the workshop

## Summary
This repo tries to help understand how to build an REST API using node.js. It implements several scenarios through different branches. 

## Use cases
Each branch represents a step in the evolution of entire final project.

### List of Branches
- **part-1**: The simplest case, an basic api rest demo with pure javascript (no babel, no typescript), but using linter eslint.
- **part-2**: Implementing the code using babel
- **part-3**: It's time to validate http request from body and path params
- **part-4**: THIS BRANCH Documenting our API with open api (swagger)
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

## Objectives of this part
We'll create the API Documentation using Swagger (Open API). The result will be an especially endpoint /docs with all specifications of endpoints of our API. Also, we'll describe request parameters and response properties, exceptions, and so on.

## Implementations Steps
**Notes**: This is the Part 4 of the workshop, the following steps update the codebase of previous part.
The procedure that I've followed to create this new branch was:
1. Once the branch part-3 is finished:
  1.1. commit all my code and push them
  1.2. After commit and push, merge part-2 into master
  ```shell
  git checkout master
  git merge part-3
  ```
  1.3. create new branch part-4
  ```shell
  git checkout -b part-4
  ```

2. Install needed libraries 
```shell
npm i swagger2 swagger2-koa
```

3. Create utils/api-docs.js file
```javascript
// utils/api-docs.js
import path from 'path'
import * as swagger from 'swagger2'
import { ui } from 'swagger2-koa'

const file = path.join(__dirname, 'docs.yaml')
const document = swagger.loadDocumentSync(file)

export default ui(document, '/docs')

```
5. Create utils/docs.yaml 
This file caintains all metadata to expose the documentatios of all endpoints of our API.
```yaml
swagger: '2.0'
info:
  title: API Rest example using node.js and koa.js
  version: '1.0'
  description: Basic API Rest example using koa, babel, mongoose and relevant technologies
host: api-rest-using-nodejs-workshop
basePath: /
schemes:
  - http
  - https
paths:
  /person/{country}/{gender}/{rows}/{page}:
    get:
      tags:
        - Person
        - People
      summary: 'get a list of people by country iso two letter code, gender (male or female) and eye color (optional)'
      parameters:
        - in: path
          name: country
          type: string
          required: true
          description: 'iso two letter code of country, for example: PE, US, CL'
        - in: path
          name: gender
          type: string
          required: true
          enum:
            - male
            - female
          description: 'gender of person that you can filter by'
        - in: path
          name: rows
          type: integer
          required: true
          description: 'rows per page'
          default: 10
        - in: path
          name: page
          type: integer
          required: true
          description: 'page number'
          default: 1
      produces:
        - application/json
      responses:
        '200':
          description: OK
          schema:
            title: People
            type: array
            items:
              $ref: '#/definitions/Person'
        '400':
          description: Bad Request
          schema:
            $ref: '#/definitions/Error'
        '404':
          description: Not Found
          schema:
            $ref: '#/definitions/Error'
        '500':
          description: Internal Server Error
          schema:
            $ref: '#/definitions/Error'
  /person:
    post:
      summary: 'Allows create or update a person'
      responses:
        '200':
          description: Updated
          schema:
            title: Person
            type: object
        '201':
          description: Created
          schema:
            title: Person
            type: object
        '400':
          description: Bad Request
          schema:
            $ref: '#/definitions/Error'
        '500':
          description: Internal Server Error
          schema:
            $ref: '#/definitions/Error'
      deprecated: false
  /person/{index}:
    delete:
      summary: 'Allows delete a person by specified index'
      parameters:
        - in: path
          name: index
          type: integer
          required: true
          description: 'unique index number of person'
      responses:
        '200':
          description: OK
          schema:
            title: Person
            type: object
        '400':
          description: Bad Request
          schema:
            $ref: '#/definitions/Error'
        '404':
          description: Not Found
          schema:
            $ref: '#/definitions/Error'
        '500':
          description: Internal Server Error
          schema:
            $ref: '#/definitions/Error'

      deprecated: false
definitions:
  Person:
    description: 'Represent a person info'
    type: object
    properties:
      index:
        description: 'unique integer value for the person'
        type: integer
      age:
        description: 'age of person'
        type: integer
      eyeColor:
        type: string
      name:
        type: string
      gender:
        type: string
      company:
        type: string
      country:
        type: string
      email:
        type: string
      phone:
        type: string
      address:
        type: string
  Error:
    type: object
    properties:
      title:
        type: string
      type:
        type: string
      detail:
        type: string
      instance:
        type: string
      invalidparams:
        type: string

```
6. Create utils/api-docs.js file
```javascript
import path from 'path'
import * as swagger from 'swagger2'
import { ui } from 'swagger2-koa'

const docFile = path.join(__dirname, 'docs.yaml')

const document = swagger.loadDocumentSync(docFile)

export default ui(document, '/docs')

```
7. Create models/error.model.js file
```javascript
const toResponse = (status, params) => {
  const { title, detail, instance } = params

  return {
    type: 'about:blank',
    title,
    status,
    detail,
    instance
  }
}

export default class {
  static notFound (ctx) {
    ctx.status = 404
    ctx.body = toResponse(ctx.status, {
      title: 'Not Found',
      detail: '',
      instance: ctx.url
    })
    return ctx.body
  }

  static internalServerError (ctx, err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = toResponse(ctx.status, {
      title: err.message,
      detail: err.stack,
      instance: ctx.url
    })
    return ctx.body
  }
}

```

8. Update the src/server.js file, adding the utils/api-docs.js and utils/api-error.js middlewares
- Add imports:

- import docs from './utils/api-docs'
- import apiError from './utils/api-error'


- Add two new middleware to the server

- .use(apiError)
- .use(docs)

- **See complete server.js file:**

```javascript
import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import yenv from 'yenv'
import mongoose from 'mongoose'
import routes from './routes'
import docs from './utils/api-docs'
import apiError from './utils/api-error'

const env = yenv()
const server = new Koa()

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

8. It's time to test our code, from the terminal run:
```shell
npm run dev
```
and then from the browser or postman call localhost:3000/person/1

You can also test de following:
POST http://localhost:3000/person/
{
	"index" : 1001,
	"age" : 14,
	"eyeColor" : "black",
	"name" : "Camila Rivero",
	"gender" : "male",
	"company" : "BCP",
	"country" : "PE",
	"email" : "camila@urbanshee.com",
	"phone" : "+1 (900) 521-2063",
	"address" : "921 Karweg Place, Connerton, Arkansas, 3696"
}

DELETE http://localhost:3000/person/1001

GET http://localhost:3000/person/PE/male/green

# api-rest-using-nodejs-workshop

# This Branch is the Part 3 of the workshop

## Summary
This repo tries to help understand how to build an REST API using node.js. It implements several scenarios through different branches. 

## Use cases
Each branch represents a step in the evolution of entire final project.

### List of Branches
- **part-1**: The simplest case, an basic api rest demo with pure javascript (no babel, no typescript), but using linter eslint.
- **part-2**: Implementing the code using babel
- **part-3**: THIS BRANCH It's time to validate http request from body and path params
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
**Notes**: Remember that, this is the Part 3 of the workshop, the following steps update the base code of part 2.


1. Install request validation library from npm
```shell
npm i @hapi/joi
```

2. Add utils folder inside src folder
3. Create utils/schema-validator.js file
```javascript
// utils/schema-validator.js
const validateRequest = (contextPart, label, schema, options) => {
  if (!schema) return
  const { error } = schema.validate(contextPart, options)
  if (error) {
    throw new Error(`Invalid ${label} - ${error.message}`)
  }
}

const validate = schema => (ctx, next) => {
  try {
    validateRequest(ctx.headers, 'Headers', schema.headers, { allowUnknown: true })
    validateRequest(ctx.params, 'URL Parameters', schema.params)
    validateRequest(ctx.query, 'URL Query', schema.query)
    if (ctx.request.body) {
      validateRequest(ctx.request.body, 'Request Body', schema.body)
    }
    return next()
  } catch (error) {
    ctx.throw(422, error.message)
  }
}

export default validate

```

4. Add schemas folder

5. Create schemas/person.schema.js
```javascript
import Joi from '@hapi/joi'

const byIndex = Joi.object()
  .keys({
    index: Joi
      .number()
      .min(1)
      .required()
  })

const post = Joi.object()
  .keys({
    index: Joi.number().min(1).required(),
    age: Joi.number().min(5).max(100).required(),
    eyeColor: Joi.string()
      .valid('black', 'blue', 'green', 'brown', 'grey').required(),
    name: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').required(),
    company: Joi.string().required(),
    country: Joi.string().length(2).uppercase().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required()
  })

const deleteByIndex = Joi.object()
  .keys({
    index: Joi
      .number()
      .min(1)
      .required()
  })

const byQuery = Joi.object()
  .keys({
    country: Joi
      .string()
      .length(2)
      .uppercase()
      .required(),
    gender: Joi
      .string()
      .valid('male', 'female'),
    eye: Joi
      .string()
      .valid('black', 'blue', 'green', 'brown', 'grey')
  })

export default {
  post,
  byIndex,
  byQuery,
  deleteByIndex
}

```
6. update repositories/person.repository.js file
```javascript
import PersonModel from '../models/person.model'

export default class PersonRepository {
  async find (filter) {
    return await PersonModel.findOne(filter)
  }

  async save (filter, person, upsert = true) {
    const options = { upsert: upsert }
    await PersonModel.findOneAndUpdate(filter, person, options)
  }

  async delete (index = 0) {
    await PersonModel.deleteOne({ index: index })
  }
}

```
Note: replace the url template with your values (your-user-here, your-password-here, your-cluster-url, your-database-here)
add env.yaml to .gitignore (for security reasons)

7. Update controllers/person.controller.js
  ```javascript
import PersonRepository from '../repositories/person.repository'
const repository = new PersonRepository()

export default class PersonController {
  async getByIndex (ctx) {
    const index = parseInt(ctx.params.index)
    const filter = { index: index }
    const data = await repository.find(filter)
    if (data) {
      ctx.body = data
    } else {
      ctx.throw(404, `There is no person with index number: ${index}`)
    }
  }

  async getByQuery (ctx) {
    const filter = {
      country: ctx.params.country,
      gender: ctx.params.gender
    }
    if (ctx.params.eye) {
      filter.eyeColor = ctx.params.eye
    }
    const data = await repository.find(filter)
    if (data) {
      ctx.body = data
    } else {
      ctx.throw(404, `There is no person with coountry: ${ctx.params.country}, gender: ${ctx.params.gender}`)
    }
  }

  async delete (ctx) {
    try {
      const index = parseInt(ctx.params.index)
      await repository.delete(index)
      ctx.status = 200
      ctx.body = {
        status: 'success'
      }
    } catch (error) {
      ctx.throw(500, `An error has ocurred: ${error}`)
    }
  }

  async save (ctx) {
    try {
      const data = ctx.request.body
      await repository.save(data)
      ctx.status = 201
      ctx.body = {
        status: 'success',
        data: data
      }
    } catch (error) {
      ctx.throw(500, `An error has ocurred: ${error}`)
    }
  }
}

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

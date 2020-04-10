import PersonRepository from '../repositories/person.repository'
import Query from '../models/query.model'

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
    const query = new Query(filter, parseInt(ctx.params.rows), parseInt(ctx.params.page))
    const data = await repository.find(query)
    if (data) {
      ctx.body = data
    } else {
      ctx.throw(404, `There is no person with coountry: ${ctx.params.country}, gender: ${ctx.params.gender}`)
    }
  }

  async delete (ctx) {
    const index = parseInt(ctx.params.index)
    const exists = await repository.exists({ index: index })
    if (exists) {
      await repository.delete(index)
      ctx.status = 200
      ctx.body = {
        status: 'success'
      }
    } else {
      ctx.throw(404, `There is not a person with index: ${index}`)
    }
  }

  async save (ctx) {
    try {
      const data = ctx.request.body
      await repository.save(data, true)
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

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

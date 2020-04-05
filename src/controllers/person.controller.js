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

import PersonModel from '../models/person.model'

export default class PersonRepository {
  async find (filter) {
    return await PersonModel.findOne(filter)
  }
}

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

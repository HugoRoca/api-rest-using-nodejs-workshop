import PersonModel from '../models/person.model'

export default class PersonRepository {
  /**
   *
   * @param {models/query.model} query - contains filter object with fields and value of query, rowsPerPage as int, page as int and getSkip() method
   */
  async find (query) {
    console.log(query)
    console.log(query.getSkip())
    return await PersonModel
      .find(query.filter)
      .skip(query.getSkip())
      .limit(query.rowsPerPage)
  }

  async exists (filter) {
    return await PersonModel.exists(filter)
  }

  async save (person, upsert = true) {
    const filter = { index: person.index }
    const options = { upsert: upsert }
    await PersonModel.updateOne(filter, person, options)
  }

  async delete (index = 0) {
    await PersonModel.deleteOne({ index: index })
  }
}

const personModel = require('../models/person.model')

module.exports = class PersonRepository {
  async find (filter) {
    return await personModel.findOne(filter)
  }
}

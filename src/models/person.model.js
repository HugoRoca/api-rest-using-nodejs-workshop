const mongoose = require('mongoose')
const schema = new mongoose.Schema({
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

const PersonModel = mongoose.model('PersonModel', schema)

module.exports = PersonModel

import { Schema, model } from 'mongoose'

const schema = new Schema({
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

const PersonModel = model('PersonModel', schema)

export default PersonModel

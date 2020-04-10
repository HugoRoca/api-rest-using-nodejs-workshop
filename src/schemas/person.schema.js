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
    rows: Joi
      .number()
      .min(1)
      .default(10),
    page: Joi
      .number()
      .min(1)
      .default(1)
  })

export default {
  post,
  byIndex,
  byQuery,
  deleteByIndex
}

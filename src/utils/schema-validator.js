const validateRequest = (contextPart, label, schema, options) => {
  if (!schema) return
  const { error } = schema.validate(contextPart, options)
  if (error) {
    throw new Error(`Invalid ${label} - ${error.message}`)
  }
}

const validate = schema => (ctx, next) => {
  try {
    validateRequest(ctx.headers, 'Headers', schema.headers, { allowUnknown: true })
    validateRequest(ctx.params, 'URL Parameters', schema.params)
    validateRequest(ctx.query, 'URL Query', schema.query)
    if (ctx.request.body) {
      validateRequest(ctx.request.body, 'Request Body', schema.body)
    }
    return next()
  } catch (error) {
    ctx.throw(422, error.message)
  }
}

export default validate

import ResponseError from '../models/error.model'

export default async (ctx, next) => {
  try {
    await next()
    if (!ctx.body && (!ctx.status || ctx.status === 404)) {
      return ResponseError.notFound(ctx)
    }
  } catch (error) {
    return ResponseError.internalServerError(ctx, error)
  }
}

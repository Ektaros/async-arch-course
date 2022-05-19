const logger = require('../logger')

module.exports = async (ctx, next) => {
  await next()

  const logData = {
    method: ctx.method,
    status: ctx.status,
    path: ctx.path,
  }

  if (ctx.state.publicId) {
    Object.assign(logData, ctx.state)
  }

  logger.debug('Processed request http request', logData)
}

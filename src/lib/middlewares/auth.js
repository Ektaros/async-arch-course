const authConfig = require('../../auth/config')

// TODO: real auth with real sessions and stuff

module.exports = (accountGetter) => {
  return async (ctx, next) => {
    const publicId = ctx.cookies.get(authConfig.authCookieName)

    if (!publicId) return (ctx.status = 401)

    ctx.state.session = await accountGetter(publicId)
    await next()
  }
}

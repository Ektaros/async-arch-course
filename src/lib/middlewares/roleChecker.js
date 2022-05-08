module.exports = (roles) => {
  return async (ctx, next) => {
    const { role } = ctx.state.session || {}

    if (!role || !roles?.include(role)) return (ctx.status = 401)

    await next()
  }
}

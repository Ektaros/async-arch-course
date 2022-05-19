module.exports = (roles) => {
  return async (ctx, next) => {
    const { role } = ctx.state.session || {}

    if (!role || !roles?.includes(role)) return (ctx.status = 401)

    await next()
  }
}

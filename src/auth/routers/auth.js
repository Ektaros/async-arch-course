const Router = require('@koa/router')
const config = require('../config')
const { authMiddleware } = require('../middlewares')
const { accountLogic } = require('../logic')
const { accountStore } = require('../stores')

const router = new Router({
  prefix: '/auth',
})

const defaultRedirect = `http://localhost:${config.port}/account`

router.post('/register', async (ctx) => {
  const { login, role, name, email } = ctx.request.body
  const { redirectUrl } = ctx.request.params

  const publicId = await accountLogic.register({ login, role, name, email })

  ctx.cookies.set(config.authCookieName, publicId)
  ctx.redirect(redirectUrl || defaultRedirect)
})

router.post('/login', async (ctx) => {
  const { login } = ctx.request.body
  const { redirectUrl } = ctx.request.params

  const { publicId } = await accountStore.getByLogin(login)

  ctx.cookies.set(config.authCookieName, publicId)
  ctx.redirect(redirectUrl || defaultRedirect)
})

router.post('/logout', authMiddleware, async (ctx) => {
  ctx.cookies.set(config.authCookieName, null)
})

module.exports = router

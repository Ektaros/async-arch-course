const Router = require('@koa/router')
const { authMiddleware } = require('../middlewares')
const { accountLogic } = require('../logic')
const { accountStore } = require('../stores')

const router = new Router({
  prefix: '/account',
})

router.get('/', authMiddleware, async (ctx) => {
  const { id } = ctx.state.session
  ctx.body = await accountStore.get(id)
})

router.get('/all', authMiddleware, async (ctx) => {
  ctx.body = await accountStore.getAll()
})

router.patch('/', authMiddleware, async (ctx) => {
  const { id } = ctx.state.session
  const { role, name, email } = ctx.request.body

  ctx.body = await accountLogic.update(id, { role, name, email })
})

module.exports = router

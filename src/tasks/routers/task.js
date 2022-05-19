const Router = require('@koa/router')
const { roleChecker } = require('../../lib/middlewares')
const { authMiddleware } = require('../middlewares')
const { taskLogic } = require('../logic')
const { taskStore } = require('../stores')

const router = new Router({
  prefix: '/tasks',
})

router.get('/my', authMiddleware, async (ctx) => {
  const { id } = ctx.state.session
  ctx.body = await taskStore.getMy(id)
})

router.get('/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.request.params
  ctx.body = await taskStore.get(id)
})

router.post('/', authMiddleware, async (ctx) => {
  const { title, description } = ctx.request.body

  ctx.body = await taskLogic.add({ title, description })
})

router.post('/complete', authMiddleware, async (ctx) => {
  const { id: accountId } = ctx.state.session
  const { taskId } = ctx.request.body

  ctx.body = await taskLogic.complete(accountId, taskId)
})

router.post('/reassign', authMiddleware, roleChecker(['admin', 'manager']), async (ctx) => {
  ctx.body = await taskLogic.reassignAll()
})

module.exports = router

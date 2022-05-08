const Router = require('@koa/router')
const { roleChecker } = require('../../lib/middlewares')
const { authMiddleware } = require('../middlewares')
const { taskLogic } = require('../logic')
const { taskStore } = require('../stores')

const router = new Router({
  prefix: '/tasks',
})

router.get('/my', authMiddleware, async (ctx) => {
  const { publicId } = ctx.state.session
  ctx.body = await taskStore.getMy(publicId)
})

router.get('/:taskPublicId', authMiddleware, async (ctx) => {
  const { taskPublicId } = ctx.request.params
  ctx.body = await taskStore.get(taskPublicId)
})

router.post('/', authMiddleware, async (ctx) => {
  const { title, description } = ctx.request.body

  ctx.body = await taskLogic.add({ title, description })
})

router.post('/complete', authMiddleware, async (ctx) => {
  const { publicId: accountPublicId } = ctx.state.session
  const { taskPublicId } = ctx.request.body

  ctx.body = await taskLogic.complete(accountPublicId, taskPublicId)
})

router.post('/reassign', authMiddleware, roleChecker(['admin', 'manager']), async (ctx) => {
  ctx.body = await taskLogic.reassignAll()
})

module.exports = router

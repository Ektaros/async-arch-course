const Router = require('@koa/router')
const { roleChecker } = require('../../lib/middlewares')
const { authMiddleware } = require('../middlewares')
const { taskLogic } = require('../logic')
const { taskStore } = require('../stores')

const router = new Router({
  prefix: '/tasks',
})

router.get('/:taskId', authMiddleware, async (ctx) => {
  const { taskId } = ctx.request.params
  ctx.body = await taskStore.get(taskId)
})

router.get('/my', authMiddleware, async (ctx) => {
  const { publicId } = ctx.state.session
  ctx.body = await taskStore.getMy(publicId)
})

router.post('/', authMiddleware, async (ctx) => {
  const { title, description } = ctx.request.body

  ctx.body = await taskLogic.add({ title, description })
})

router.post('/reassign', authMiddleware, roleChecker(['admin', 'manager']), async (ctx) => {
  ctx.body = await taskLogic.reassignAll()
})

module.exports = router

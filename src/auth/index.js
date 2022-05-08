const Koa = require('koa')
const config = require('./config')
const routers = require('./routers')
const logger = require('../lib/logger')
const { loggerMiddleware, koaBody } = require('../lib/middlewares')

const app = new Koa()

app.use(koaBody)
app.use(loggerMiddleware)

Object.values(routers).forEach((router) => {
  app.use(router.allowedMethods())
  app.use(router.routes())
})

app.listen(config.port, () => logger.info(`Server started on port ${config.port}`))

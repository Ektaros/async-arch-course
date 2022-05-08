const Koa = require('koa')
const config = require('./config')
const routers = require('./routers')
const consumers = require('./consumers')
const logger = require('../lib/logger')
const { loggerMiddleware, koaBody } = require('../lib/middlewares')

const app = new Koa()

app.use(koaBody)
app.use(loggerMiddleware)

Object.values(routers).forEach((router) => {
  app.use(router.allowedMethods())
  app.use(router.routes())
})

Object.values(consumers).forEach((consumer) => consumer.start())

app.listen(config.port, () => logger.info(`Tasks service started on port ${config.port}`))

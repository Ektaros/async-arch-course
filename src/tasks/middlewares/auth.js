const { authMiddleware } = require('../../lib/middlewares')
const { taskStore } = require('../stores')

module.exports = authMiddleware((publicAccountId) => taskStore.getAccount(publicAccountId))

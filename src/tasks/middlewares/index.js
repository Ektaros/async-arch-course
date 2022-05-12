const { authMiddleware } = require('../../lib/middlewares')
const { taskStore } = require('../stores')

module.exports = {
  authMiddleware: authMiddleware((publicAccountId) => taskStore.getAccountByPublicId(publicAccountId)),
}

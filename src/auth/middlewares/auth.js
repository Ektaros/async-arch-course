const { authMiddleware } = require('../../lib/middlewares')
const { accountStore } = require('../stores')

module.exports = authMiddleware((publicId) => accountStore.get(publicId))

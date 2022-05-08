const { accountStore } = require('../stores')
const publisher = require('../publisher')
const logger = require('../../lib/logger')

const register = async ({ login, role, name, email }) => {
  const account = await accountStore.create({ login, role, name, email })
  logger.debug('created account', account)

  if (account) await publisher.sendAccountStream('created', account.publicId, account)

  return account.publicId
}
const update = async (publicId, { role, name, email }) => {
  const success = await accountStore.update(publicId, { role, name, email })

  logger.debug('update account', { success, publicId, role, name, email })

  if (success) await publisher.sendAccountStream('updated', publicId, { role, name, email })

  return success
}

module.exports = {
  register,
  update,
}

const { accountStore } = require('../stores')
const publisher = require('../publisher')
const logger = require('../../lib/logger')

const add = async ({ login, role, name, email }) => {
  const account = await accountStore.create({ login, role, name, email })
  logger.debug('created account', account)

  if (account) await publisher.sendAccountStream('created', account.publicId, account)

  return account.publicId
}

const reassign = async () => {}

module.exports = {
  add,
  reassign,
}

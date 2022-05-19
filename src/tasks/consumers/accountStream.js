const { taskStore } = require('../stores')

const handlers = {
  created: (data) => taskStore.createAccount(data),
  updated: (data) => taskStore.updateAccount(data),
}

module.exports = async ({ eventName, data }) => {
  const handler = handlers[eventName]

  if (!handler) throw new Error(`No handler found for event: ${eventName} in accountStream`)

  await handler(data)
}

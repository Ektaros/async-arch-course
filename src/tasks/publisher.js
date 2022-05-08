const { SimplePublisher } = require('../lib/kafka')
const logger = require('../lib/logger')
const config = require('./config')

const publisher = new SimplePublisher(config.kafka)

// TODO: add validation (ajv), versions, eventId (for idempotency), method for every event name (with wrapper)

module.exports = {
  sendTaskStream: async (eventName, key, data) => {
    const event = {
      eventName,
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'auth-service',
      data,
    }

    logger.debug('sending event', { eventName, event })

    await publisher.send('account-stream', key, event)
  },
  sendTaskEvent: async (eventName, key, data) => {},
}

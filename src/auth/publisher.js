const { SimplePublisher } = require('../lib/kafka')
const logger = require('../lib/logger')
const config = require('./config')

const publisher = new SimplePublisher(config.kafka)

// TODO: add validation (ajv), versions, eventId (for idempotency), method for every event name (with wrapper)

module.exports = {
  sendAccountStream: async (eventName, publicId, { login, name, email, role }) => {
    const event = {
      eventName,
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'auth-service',
      data: { publicId, login, name, email, role },
    }

    logger.debug('sending event', { eventName, event })

    await publisher.send('accountStream', key, event)
  },
}

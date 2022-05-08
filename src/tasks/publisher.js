const { SimplePublisher } = require('../lib/kafka')
const logger = require('../lib/logger')
const config = require('./config')

const publisher = new SimplePublisher(config.kafka)

// TODO: add validation (ajv), versions, eventId (for idempotency), method for every event name (with wrapper)

module.exports = {
  sendTaskStream: async (eventName, taskPublicId, data) => {
    const event = {
      eventName,
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'tasks-service',
      data,
    }

    logger.debug('sending cud task event', { eventName, event })

    await publisher.send('tasksStream', taskPublicId, event)
  },
  sendTaskAssigned: async (taskPublicId, data) => {
    const event = {
      eventName: 'assigned',
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'tasks-service',
      data,
    }

    logger.debug('sending task assigned event', { event })

    await publisher.send('tasks', taskPublicId, event)
  },
}

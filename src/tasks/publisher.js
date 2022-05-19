const { SimplePublisher } = require('../lib/kafka')
const logger = require('../lib/logger')
const config = require('./config')

const publisher = new SimplePublisher(config.kafka)

// TODO: add validation (ajv), versions, eventId (for idempotency), method for every event name (with wrapper)

module.exports = {
  sendTaskStream: async (eventName, publicId, { title, description }) => {
    const event = {
      eventName,
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'tasks-service',
      data: { publicId, title, description },
    }

    logger.debug('sending cud task event', { eventName, event })

    await publisher.send('tasksStream', taskPublicId, event)
  },
  sendTaskAssigned: async (publicId, assigneePublicId) => {
    const event = {
      eventName: 'assigned',
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'tasks-service',
      data: { publicId, assigneePublicId },
    }

    logger.debug('sending task assigned event', { event })

    await publisher.send('tasks-lifecycle', publicId, event)
  },
  // TODO: redo this trash approach
  sendTaskAssignedBatch: async (eventsData) => {
    const batch = eventsData.map(({ publicId, assigneePublicId }) => ({
      key: publicId,
      data: {
        eventName: 'assigned',
        eventVersion: 1,
        eventTime: Date.now(),
        producer: 'tasks-service',
        data: { publicId, assigneePublicId },
      },
    }))

    logger.debug('sending task assigned  batch', { batch })

    await publisher.sendBatch('tasks-lifecycle', batch)
  },
  sendTaskCompleted: async (taskPublicId, accountPublicId) => {
    const event = {
      eventName: 'completed',
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'tasks-service',
      data: { taskPublicId, accountPublicId },
    }

    logger.debug('sending task completed event', { event })

    await publisher.send('tasks-lifecycle', publicId, event)
  },
}

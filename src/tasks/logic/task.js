const { taskStore } = require('../stores')
const publisher = require('../publisher')
const logger = require('../../lib/logger')

const add = async ({ title, description }) => {
  const assignee = await taskStore.getRandomWorkerId()
  if (!assignee) throw new Error('No wrokers available for the task')

  const task = await taskStore.create({ title, description, assignee })
  const taskPublicId = task.publicId
  logger.debug('created task', task)

  await publisher.sendTaskStream('created', taskPublicId, task)
  await publisher.sendTaskAssigned(taskPublicId, { taskPublicId, assignee })

  return taskPublicId
}

const reassign = async () => {}

module.exports = {
  add,
  reassign,
}

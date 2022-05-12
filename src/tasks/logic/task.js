const { sample } = require('lodash')
const { taskStore } = require('../stores')
const publisher = require('../publisher')
const logger = require('../../lib/logger')

const add = async ({ title, description }) => {
  const account = await taskStore.getRandomWorker()
  if (!account) throw new Error('No wrokers available for the task')

  const task = await taskStore.create({ title, description, assignee: account.id })
  const taskPublicId = task.publicId
  logger.debug('created task', task)

  await publisher.sendTaskStream('created', taskPublicId, task)
  await publisher.sendTaskAssigned(taskPublicId, { taskPublicId, assignee: account.publicId })

  return task
}

const complete = async (accountId, taskId) => {
  const success = await taskStore.complete(accountId, taskId)

  if (success) {
    const { publicId } = await taskStore.get(taskId)
    await publisher.sendTaskCompleted(publicId)
  }

  return success
}

const reassignAll = async () => {
  const accountsPool = await taskStore.getAllWorkersIds()
  const tasksPool = await taskStore.getAllOpen()

  const eventsData = []

  await Promise.allSettled(
    tasksPool.map(async (task) => {
      const account = sample(accountsPool)

      const success = await taskStore.reassign(task.id, account.id)

      if (success) eventsData.push({ taskPublicId: task.publicId, assigneePublicId: account.publicId })
    })
  )

  await publisher.sendTaskCompletedBatch(eventsData)
}

module.exports = {
  add,
  complete,
  reassignAll,
}

module.exports = {
  port: 3456,
  mysql: {
    host: 'localhost',
    port: 3333,
    user: 'user',
    password: 'secure',
    database: 'popugs-tasks',
  },
  kafka: {
    clientId: 'tasks-service',
    groupId: 'tasks-service',
    brokers: ['localhost:29092'],
  },
}

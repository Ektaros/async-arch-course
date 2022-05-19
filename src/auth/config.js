module.exports = {
  port: 2345,
  authCookieName: 'popug-jira-sup-auth',
  mysql: {
    host: 'localhost',
    port: 3333,
    user: 'user',
    password: 'secure',
    database: 'popugs-auth',
  },
  kafka: {
    clientId: 'auth-service',
    brokers: ['localhost:29092'],
  },
}

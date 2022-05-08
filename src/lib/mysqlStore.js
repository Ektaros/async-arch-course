const mysql2 = require('mysql2')
const logger = require('./logger')

const createPool = ({ host, port, user, password, database }) => {
  const pool = mysql2.createPool({
    host,
    port,
    user,
    password,
    database,
    namedPlaceholders: true,
  })

  pool.getConnection((err, con) => {
    if (err?.fatal) {
      logger.warn(`Failed to connect to '${database}' MySQL at ${host}:${port}, exiting`)
      logger.error(err)
      process.exit(1)
    } else if (con) {
      logger.info(`Connected to '${database}' MySQL at ${host}:${port}`)
      con.release()
    }
  })

  return pool.promise()
}

class MysqlStore {
  constructor(config, initialQueries) {
    this.db = createPool(config)
    this.ready = this.init(initialQueries)
  }

  async init(initialQueries) {
    if (!initialQueries?.length) return

    await initialQueries.reduce(async (promise, value) => {
      await promise
      const queries = Array.isArray(value) ? value : [value]

      await Promise.all(queries.map((query) => this.db.query(query)))
    }, Promise.resolve())
  }

  async query(queryString, params) {
    await this.ready

    return this.db.query(queryString, params)
  }
}

module.exports = MysqlStore

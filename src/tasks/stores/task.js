const { v4: uuidv4 } = require('uuid')
const MysqlStore = require('../../lib/mysqlStore')
const { mysql } = require('../config')

// TODO redo stores interface approach

class AccountStore extends MysqlStore {
  constructor() {
    super(mysql, [
      [
        `
        CREATE TABLE IF NOT EXISTS accounts (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          publicId UUID NOT NULL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          role ENUM('worker', 'accountant', 'admin', 'manager'),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY (publicId)
        )
      `,
      ],
      [
        `
        CREATE TABLE IF NOT EXISTS tasks (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          publicId UUID NOT NULL,
          title VARCHAR(100) NOT NULL,
          description TEXT,
          status ENUM('open', 'completed') DEFAULT 'open',
          assignee INT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY (publicId),
          FOREIGN KEY (assignee) REFERENCES accounts (publicId) ON DELETE RESTRICT
        )
      `,
      ],
    ])
  }
  // TODO separate!!!
  // account methods -------------------------------------------------
  async getAccount(publicId) {
    const [[account]] = await this.query('SELECT * FROM accounts WHERE publicId = :publicId', { publicId })

    return account
  }

  async getRandomWorker() {
    const excludedRoles = ['manager', 'admin']
    const [[account]] = await this.query(
      `
        SELECT id, publicId FROM accounts 
        WHERE role NOT IN (:excludedRoles)
        ORDER BY RAND()
        LIMIT 1
      `,
      { excludedRoles }
    )

    return account
  }
  async getAllWorkers() {
    const excludedRoles = ['manager', 'admin']
    const [accounts] = await this.query('SELECT id, publicId FROM accounts WHERE role NOT IN (:excludedRoles)', { excludedRoles })

    return accounts
  }

  async createAccount({ publicId, name, email, role }) {
    await this.query(
      `INSERT INTO accounts (
        publicId,
        name,
        email,
        role
      ) VALUES (
        :publicId,
        :name,
        :email,
        :role
      )
    `,
      { publicId, name, email, role }
    )
  }
  async updateAccount({ publicId, name, email, role }) {
    const fields = []
    if (name) fields.push('name = :name')
    if (role) fields.push('role = :role')
    if (email) fields.push('email = :email')

    if (!fields.length) return false

    const [{ changedRows }] = await this.query(
      `
      UPDATE accounts 
        SET ${fields.join()}
      WHERE publicId = :publicId
    `,
      { publicId, name, email, role }
    )

    return Boolean(changedRows)
  }
  // task methods ----------------------------------------------------
  async create(taskData) {
    const [[task]] = await this.query(
      `INSERT INTO tasks (
        publicId, title, description, assignee
      ) VALUES (
        :publicId, :title, :description, :assignee
      ) RETURNING *
    `,
      {
        ...taskData,
        publicId: uuidv4(),
      }
    )

    return task
  }
  async get(id) {
    const [[task]] = await this.query('SELECT * FROM tasks WHERE id = :id', { id })

    return task
  }
  async getMy(accountId) {
    const [tasks] = await this.query('SELECT * FROM tasks WHERE assignee = :accountId', { accountId })

    return tasks
  }
  async getAllOpen() {
    const [tasks] = await this.query(`SELECT id, publicId, assignee FROM tasks WHERE status = 'open'`)

    return tasks
  }
  async reassign(taskId, assignee) {
    const [{ changedRows }] = await this.query(
      `
      UPDATE tasks 
      SET assignee = :assignee
      WHERE id = :taskId and status = 'open'
    `,
      { taskId, assignee }
    )

    return Boolean(changedRows)
  }
  async complete(accountPublicId, taskPublicId) {
    const [{ changedRows }] = await this.query(
      `
      UPDATE tasks 
      SET status = 'completed'
      WHERE publicId = :taskPublicId and assignee = :accountPublicId and status = 'open'
    `,
      { accountPublicId, taskPublicId }
    )

    return Boolean(changedRows)
  }
}

module.exports = new AccountStore()

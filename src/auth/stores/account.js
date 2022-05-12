const { v4: uuidv4 } = require('uuid')
const MysqlStore = require('../../lib/mysqlStore')
const { mysql } = require('../config')

class AccountStore extends MysqlStore {
  constructor() {
    super(mysql, [
      [
        `CREATE TABLE IF NOT EXISTS accounts (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        publicId UUID NOT NULL,
        login VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        role ENUM('worker', 'accountant', 'admin', 'manager'),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY (publicId),
        UNIQUE KEY (login)
      )
    `,
      ],
    ])
  }

  async get(id) {
    const [[account]] = await this.query('SELECT * FROM accounts WHERE id = :id', { id })

    return account
  }

  async getByLogin(login) {
    const [[account]] = await this.query('SELECT * FROM accounts WHERE login = :login', { login })

    return account
  }

  async getAll() {
    const [accounts] = await this.query('SELECT * FROM accounts')

    return accounts
  }

  async create(accountData) {
    const [[account]] = await this.query(
      `INSERT INTO accounts (
        publicId,
        login,
        name,
        email,
        role
      ) VALUES (
        :publicId,
        :login,
        :name,
        :email,
        :role
      ) RETURNING *
    `,
      {
        ...accountData,
        publicId: uuidv4(),
      }
    )

    return account
  }
  async update(id, { name, email, role }) {
    const fields = []
    if (name) fields.push('name = :name')
    if (role) fields.push('role = :role')
    if (email) fields.push('email = :email')

    if (!fields.length) return false

    const [{ changedRows }] = await this.query(
      `
      UPDATE accounts 
       SET ${fields.join(', ')}
      WHERE id = :id
    `,
      {
        id,
        name,
        email,
        role,
      }
    )

    return Boolean(changedRows)
  }
}

module.exports = new AccountStore()

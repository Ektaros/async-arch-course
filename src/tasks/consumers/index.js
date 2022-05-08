const { SimpleConsumer } = require('../../lib/kafka')
const accountStreamConsumer = require('./accountStream')
const config = require('../config')

module.exports = {
  accountStream: new SimpleConsumer('accountStream', accountStreamConsumer, config.kafka),
}

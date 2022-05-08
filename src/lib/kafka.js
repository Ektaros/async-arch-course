const { Kafka } = require('kafkajs')
const logger = require('./logger')

class SimplePublisher {
  constructor({ clientId, brokers }) {
    if (!clientId || !brokers?.length) throw new Error('Wrong publisher config')

    this.kafka = new Kafka({
      clientId,
      brokers,
    })
    this.producer = this.kafka.producer()

    this.ready = this.producer.connect()
  }

  async send(topic, key, data) {
    await this.ready
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(data) }],
    })
  }
}

class SimpleConsumer {
  constructor(topic, handler, { clientId, brokers, groupId }) {
    if (!clientId || !groupId || !brokers?.length) throw new Error('Wrong consumer config')

    this.topic = topic
    this.handler = handler

    this.kafka = new Kafka({
      clientId,
      brokers,
    })
    this.consumer = this.kafka.consumer({ groupId })
  }
  async start() {
    await this.consumer.connect()
    await this.consumer.subscribe({ topics: [this.topic] })
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        logger.debug('Got message', {
          topic,
          partition,
          message: {
            key: message.key.toString(),
            value: message.value.toString(),
            headers: message.headers,
          },
        })
        this.handler(JSON.parse(message.value.toString()))
      },
    })
  }
}

module.exports = {
  SimplePublisher,
  SimpleConsumer,
}

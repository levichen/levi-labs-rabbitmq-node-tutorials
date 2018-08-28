#!/usr/bin/env node

const amqp = require('amqplib')
const exchange = 'topic_logs'
const args = process.argv.slice(2)
const key = (args.length > 0) ? args[0] : 'anonymous.info'
const msg = { subject: 'this is subject', content: 'this is content', time: new Date() }

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()

    // declare a topic exchange
    channel.assertExchange(exchange, 'topic', { durable: false })
    // send a message to direct exchange
    channel.publish(exchange, key, Buffer.from(JSON.stringify(msg)))

    console.log(` [x] Sent ${key}:${JSON.stringify(msg)}`)

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

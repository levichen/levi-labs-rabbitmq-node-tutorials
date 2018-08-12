#!/usr/bin/env node

const amqp = require('amqplib')
const exchange = 'direct_logs'
const msg = { subject: 'this is subject', content: 'this is content', time: new Date() }

const args = process.argv.slice(2)
const severity = (args.length > 0) ? args[0] : 'info'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()

    // declare a direct exchange
    channel.assertExchange(exchange, 'direct', {durable: false})
    // send a message to direct exchange
    channel.publish(exchange, severity, Buffer.from(JSON.stringify(msg)))

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

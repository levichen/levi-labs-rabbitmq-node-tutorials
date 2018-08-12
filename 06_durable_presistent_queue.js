#!/usr/bin/env node

const amqp = require('amqplib')

const queueName = 'durable_presistent_queue'
const msg = process.argv.slice(2).join(' ') || 'Hello World!'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a queue for sending message (idempotent)
    await channel.assertQueue(queueName, { durable: true })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), { persistent: true })

    // close connection and process after 1 second
    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

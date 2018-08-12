#!/usr/bin/env node

const amqp = require('amqplib')

const queueName = 'task_queue'
const msg = process.argv.slice(2).join(' ') || 'Hello World!'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a queue for sending message (idempotent)
    await channel.assertQueue(queueName, { durable: false })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)))

    // close connection and process after 1 second
    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

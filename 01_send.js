#!/usr/bin/env node

const amqp = require('amqplib')

const queueName = 'tasks'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a queue for sending message (idempotent)
    await channel.assertQueue(queueName)
    // publish a message to the queue (async process)
    channel.sendToQueue(queueName, Buffer.from('something to do'))
    console.log(`Successfully send a message to 'tasks' queue`)

    // close connection and process after 1 second
    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

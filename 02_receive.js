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
    const queue = await channel.assertQueue(queueName)
    console.log(`Queue info: ${queue}`)

    console.log(`[*] Waiting for messages in ${queueName}. To exit press cmd+C`)
    // starting to consume 'tasks' queue
    channel.consume(queue.queue, (msg) => {
      console.log(`Got a message: ${msg.content.toString()}`)
    }, { noAck: true })
  } catch (error) {
    console.log(error)
  }
}

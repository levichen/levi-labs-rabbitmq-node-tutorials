#!/usr/bin/env node

const amqp = require('amqplib')

const queueName = 'task_queue'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a queue for sending message (idempotent)
    await channel.assertQueue(queueName, { durable: false })

    console.log(`[*] Waiting for messages in ${queueName}. To exit press cmd+C`)

    channel.consume(queueName, (msg) => {
      console.log(`Got message: ${msg.content.toString()}`)
      setTimeout(() => {
        console.log(`Finished ${msg.content.toString()}`)
      }, 5000)
    }, { noAck: true })
  } catch (error) {
    console.log(error)
  }
}

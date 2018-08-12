#!/usr/bin/env node

const amqp = require('amqplib')

const queueName = 'durable_presistent_queue'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a queue for sending message (idempotent)
    await channel.assertQueue(queueName, { durable: true })
    // set prefetch = 1
    await channel.prefetch(1)

    console.log(`[*] Waiting for messages in ${queueName}. To exit press cmd+C`)

    channel.consume(queueName, (msg) => {
      console.log(`Got message: ${msg.content.toString()}`)
      setTimeout(() => {
        console.log(`Finished ${msg.content.toString()}`)
        channel.ack(msg)
      }, 5000)
    }, { noAck: false })
  } catch (error) {
    console.log(error)
  }
}

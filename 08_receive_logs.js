#!/usr/bin/env node

const amqp = require('amqplib')

const exchange = 'logs'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a fanout exchange
    await channel.assertExchange(exchange, 'fanout', { durable: false })
    // set prefetch = 1
    await channel.prefetch(1)

    // declare a template temporary queue
    const queue = await channel.assertQueue('', { exclusive: true })

    console.log(`  [*] Waiting for messages in ${queue.queue}. To exit press cmd+C`)

    // bind relationship between exchange and a queue
    channel.bindQueue(queue.queue, exchange, '')

    channel.consume(queue.queue, (msg) => {
      setTimeout(() => {
        console.log(msg.content.toString())
      }, 3000)
    }, { noAck: true })
  } catch (error) {
    console.log(error)
  }
}

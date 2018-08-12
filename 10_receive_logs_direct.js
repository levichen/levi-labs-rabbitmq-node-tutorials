#!/usr/bin/env node

const amqp = require('amqplib')
const args = process.argv.slice(2)
const exchange = 'direct_logs'

main()
async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a direct exchange
    await channel.assertExchange(exchange, 'direct', { durable: false })

    // declare a template temporary queue
    const queue = await channel.assertQueue('', { exclusive: true })

    console.log(`  [*] Waiting for messages in ${queue.queue}. To exit press cmd+C`)

    args.forEach(function (severity) {
      // bind relationship between exchange and a queue
      channel.bindQueue(queue.queue, exchange, severity)
    })

    channel.consume(queue.queue, (msg) => {
      setTimeout(() => {
        console.log(msg.content.toString())
        console.log(` [x] ${msg.fields.routingKey} ${msg.content.toString()}`)
      }, 3000)
    }, { noAck: true })
  } catch (error) {
    console.log(error)
  }
}

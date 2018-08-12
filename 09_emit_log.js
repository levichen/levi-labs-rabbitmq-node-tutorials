#!/usr/bin/env node

const amqp = require('amqplib')

const exchange = 'logs'
const msg = { subject: 'this is subject', content: 'this is content', time: new Date() }

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()
    // declare a fanout exchange
    await channel.assertExchange(exchange, 'fanout', { durable: false })
    // send a message to exchange
    channel.publish(exchange, '', Buffer.from(JSON.stringify(msg)))

    console.log(`[x] Sent ${JSON.stringify(msg)}`)

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

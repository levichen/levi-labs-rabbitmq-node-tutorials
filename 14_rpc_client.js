#!/usr/bin/env node

const amqp = require('amqplib')
const args = process.argv.slice(2)

main()
async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()

    const corr = generateUuid()
    const num = parseInt(args[0])

    // declare a topic exchange
    const queue = await channel.assertQueue('', { exclusive: true })

    console.log(` [x] Requesting fib(${num})`)

    // send a message to rpc_queue
    channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
      correlationId: corr,
      replyTo: queue.queue
    })

    // listen callback queue
    channel.consume(queue.queue, (msg) => {
      if (msg.properties.correlationId === corr) {
        console.log(` [.] Got ${msg.content.toString()}`)

        setTimeout(() => {
          connection.close()
          process.exit(0)
        }, 500)
      }
    }, { noAck: true })
  } catch (error) {
    console.log(error)
  }
}

function generateUuid () {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString()
}

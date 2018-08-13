#!/usr/bin/env node

const amqp = require('amqplib')
const queue = 'rpc_queue'

main()

async function main () {
  try {
    // open TCP connection
    const connection = await amqp.connect('amqp://localhost')
    // open AMQP channel for sending message
    const channel = await connection.createChannel()

    // declare a queue for sending message (idempotent)
    await channel.assertQueue(queue, { durable: false })
    await channel.prefetch(1)

    console.log(` [x] Awaiting RPC requests`)

    channel.consume(queue, async function reply (msg) {
      const num = parseInt(msg.content.toString())
      console.log(` [.] Got a message: ${num} and start to execute fib(${num})`)
      const result = fibonacci(num)

      // send the result to callback queue
      console.log(` [.] Finished execution send the result to callback queue`)
      await channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()), { correlationId: msg.properties.correlationId })
      // ack this message
      console.log(` [.] Finished send to callback queue, ack this message in ${queue}`)
      await channel.ack(msg)
    })
  } catch (error) {
    console.log(error)
  }
}

function fibonacci (n) {
  if (n === 0 || n === 1) { return n } else { return fibonacci(n - 1) + fibonacci(n - 2) }
}

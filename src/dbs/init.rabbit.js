'use strict'

const amqp = require('amqplib')
const { get } = require('../models/redis.model')

const connectToRabbitMQ = async() => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        if(!connection) {
            throw new Error("Connect fail")
        }
        const channel = await connection.createChannel()

        return {channel, connection}
    } catch(err){
        throw err
    }
}

const consumerQueue = async(queueName, io) => {
    try{
        const {channel, connection} = await connectToRabbitMQ()
        await channel.assertQueue(queueName, {durable: true})
        console.log(`Waiting for messages....`)
        channel.consume(queueName, async msg => {
            const response = JSON.parse(msg.content.toString());
            const data = JSON.parse(response);
            const id = await get(data.noti_received_name)
            console.log(data)
            io.to(id).emit("getNotification", data)

        }, {noAck: true})
    }catch(err){
        console.error("err")
    }
}

module.exports = {
    connectToRabbitMQ,
    consumerQueue
}
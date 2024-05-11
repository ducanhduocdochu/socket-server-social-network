'use strict'

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit")


const messageService = {
    consumerToQueue: async(queueName) => {
        try{
            const {channel, connection } = await connectToRabbitMQ() 

            await consumerQueue(channel, queueName)
        }catch(error){
            console.error("errorrrrrrrrrrrrrrrr")
        }
    },
    // case processing
    consumerToQueueNormal: async (queueName) => {
        try{
            const {channel, connection} = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess'

            // 1. TTL
            // const timeExpired = 15000
            // setTimeout(() => {
            //     channel.consume(notiQueue, msg => {
            //         console.log(`SEND notificationQueue successfullt processed`, msg.content.toString())
            //         channel.ack(msg)
            //     })
            // }, timeExpired)

            // 2.Logic
            channel.consume(notiQueue, msg => {
                try{
                    const numberTest = Math.random()
                    console.log(numberTest)
                    if (numberTest < 0.8){
                        throw new Error('Send notificationQueue failed:: HOT FIX')
                    }
        
                    console.log(`SEND notificationQueue successfullt processed`, msg.content.toString())
                    channel.ack(msg)
                }catch(err){
                    channel.nack(msg, false, false)
                }
            })
            
        }catch(err){
            console.error("errorrrrrrrrrrrrrrrr")
        }
    },
    // case failed
    consumerToQueueFailed: async (queueName) => {
        try{
            const {channel, connection} = await connectToRabbitMQ()

            const notificationExchangeDLX = 'notificationExDLX'
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
            const notiQueueHandler = 'notificationQueueHotFix'

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            
            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })
            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, msgFailed => {
                console.log('this notification error:, pls hot fix')
            })
        }catch(err){
            console.error("errorrrrrrrrrrrrrrrr")
        }
    }
}

module.exports = messageService
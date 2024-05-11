'use strict'

const amqp = require('amqplib')

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

const connectToRabbitMQForTest = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const queue = 'test-queue';
        const message = 'Hello, shopDev by anonystick';

        await channel.assertQueue(queue, {
            durable: false 
        });

        await channel.sendToQueue(queue, Buffer.from(message));

        await connection.close();

        console.log('Message sent successfully.');
    } catch(err) {
        console.error('Error:', err);
        throw err;
    }
};

// const consumerQueue = async(queueName, websocketConnections) => {
//     try{
//         const {channel, connection} = await connectToRabbitMQ()
//         await channel.assertQueue(queueName, {durable: true})
//         console.log(`Waiting for messages....`)
//         channel.consume(queueName, msg => {
//             console.log("-------------------------")
//             console.log(`Received message: ${queueName}::`, JSON.stringify(msg.content.toString()))
//             console.log("-------------------------")

//             websocketConnections.forEach(ws => {
//                 ws.send(JSON.stringify(msg.content.toString()));
//             }, {
//             });
//             noAck: true
//         })
//     }catch(err){
//         console.error("err")
//     }
// }

const consumerQueue = async(queueName) => {
    try{
        const {channel, connection} = await connectToRabbitMQ()
        await channel.assertQueue(queueName, {durable: true})
        console.log(`Waiting for messages....`)
        channel.consume(queueName, msg => {
            console.log("-------------------------")
            console.log(`Received message: ${queueName}::`, JSON.stringify(msg.content.toString()))
            console.log("-------------------------")

        }, {noAck: true})
    }catch(err){
        console.error("err")
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}
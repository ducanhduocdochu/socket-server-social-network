'use strict'
const redisClient = require("./src/configs/config.redis");
const {consumerQueue} = require("./src/dbs/init.rabbit")
const { Server } = require("socket.io");
const { get, setKey } = require("./src/models/redis.model");

const queueName = "NEW POST"

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("addUser", async(user_name) => {
    await setKey(user_name, socket.id);
    console.log(`A client connected with ID: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`A client disconnected with ID: ${socket.id}`);
  });
});

io.listen(5000);

consumerQueue(queueName, io).then(() => {
    console.log(`Message consumer started ${queueName}`)
}).catch(err => {
    console.error(`Message Error: ${err.message}`)
})

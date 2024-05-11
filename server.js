// const express = require("express");
// const expressWs = require("express-ws");
// const cors = require('cors');
// const { consumerQueue } = require("./src/dbs/init.rabbit");
// const queueName = "new post";
// const app = express();
// expressWs(app);
// app.use(cors());
// const websocketConnections = []; // Mảng để lưu trữ các kết nối WebSocket

// app.ws("/notifications", async (ws, req) => {
//     websocketConnections.push(ws); // Thêm kết nối WebSocket mới vào mảng

//     ws.on('close', () => {
//         console.log('WebSocket connection closed');
//         const index = websocketConnections.indexOf(ws);
//         if (index > -1) {
//             websocketConnections.splice(index, 1); // Xóa kết nối WebSocket khỏi mảng khi nó đóng
//         }
//     });

//     try {
//         await consumerQueue(queueName, websocketConnections); // Truyền mảng kết nối WebSocket vào consumerQueue
//         console.log(`Message consumer started for queue "${queueName}"`);
//     } catch (err) {
//         console.error(`Message Error: ${err.message}`);
//         ws.send(JSON.stringify({ error: err.message })); // Gửi thông báo lỗi đến front-end
//     }
// });

// app.listen(5000, () => {
//     console.log("Server started on port 5000");
// });

'use strict'
const {consumerQueue, connectToRabbitMQ} = require("./src/dbs/init.rabbit")
const queueName = "new post"
consumerQueue(queueName).then(() => {
    console.log(`Message consumer started ${queueName}`)
}).catch(err => {
    console.error(`Message Error: ${err.message}`)
})

// consumerToQueueNormal(queueName).then(() => {
//     console.log(`Message consumerToQueueNormal started ${queueName}`)
// }).catch(err => {
//     console.error(`Message Error: ${err.message}`)
// })

// consumerToQueueFailed(queueName).then(() => {
//     console.log(`Message consumerToQueueFailed started ${queueName}`)
// }).catch(err => {
//     console.error(`Message Error: ${err.message}`)
// })

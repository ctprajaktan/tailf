const { createServer } = require("http")
const express = require("express");
const { Server } = require("socket.io");
const { Tail } = require("./tail")
const app = express();
const httpServer = createServer(app);

app.use(express.json())
app.use(express.static(__dirname + '/node_modules'));

const tail = new Tail("./data.txt", 10);

tail.on("data", (data) => {
    io.emit("data", data)
})

app.get('/log', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const io = new Server(httpServer)

io.on("connection", (socket) => {
    console.log("new connection")
})

httpServer.listen(3000, () => {
    console.log("server started")
})
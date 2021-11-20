const { io } = require("socket.io-client");

const client = io.connect("http://localhost:3000")

client.on("data", (data) => {
    console.log("data", data);
})
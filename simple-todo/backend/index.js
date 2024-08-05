// I should move this to TypeScript

const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");


const app = express();

const corsOptions = {
    origin: "http://localhost:3001",
}
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

app.get('/', (req, res) => {
    res.send("Hello World");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("todo", (todo) => {
        console.log("Received", todo);
        socket.emit("todo-received", todo);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

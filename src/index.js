const path = require('path');
var express = require('express');
var app = express();
const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io');
const io = socketIo(server);


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('Connected to socket!');
    socket.emit('chatGroup', 'Welcome to the chat');

    socket.on('sendMessage', (data) => {
        io.emit('chatGroup', data)
    });
});

server.listen(port , () => {
    console.log(`server is up on port ${port}!! `);
})
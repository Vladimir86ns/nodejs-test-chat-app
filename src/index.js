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

    socket.broadcast.emit('chatGroup', 'A new user has joined!');

    socket.on('sendMessage', (data) => {
        io.emit('chatGroup', data)
    });

    socket.on('geoLocation', data => {
        io.emit('chatGroup', `https://google.com/maps/@${data.long},${data.lat}`);
    })

    socket.on('disconnect', () => {
        io.emit('chatGroup', "A user has left a chat!");
    });

    socket
});

server.listen(port , () => {
    console.log(`server is up on port ${port}!! `);
})
const path = require('path');
var express = require('express');
var app = express();
const http = require('http');
const server = http.createServer(app);
var Filter = require('bad-words');
const { generateMessage, generateLocation } = require('./utils/message.js');

const socketIo = require('socket.io');
const io = socketIo(server);


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('Connected to socket!');
    socket.emit('chatGroup', generateMessage('Welcome to the chat!'));

    socket.broadcast.emit('chatGroup', generateMessage('A new user has joined!'));

    socket.on('sendMessage', (data, callback) => {
        let filter = new Filter();

        if (filter.isProfane(data)) {
           return callback("Profanity is not allowed!");
        }
        io.emit('chatGroup', data);
        callback();
    });

    socket.on('geoLocation', (data, callback) => {
        io.emit('sendLocation', generateLocation(`https://google.com/maps/@${data.long},${data.lat}`));
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('chatGroup', generateMessage('A user has left a chat!'));
    });

    socket
});

server.listen(port , () => {
    console.log(`server is up on port ${port}!! `);
})
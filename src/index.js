const path = require('path');
var express = require('express');
var app = express();
const http = require('http');
const server = http.createServer(app);
var Filter = require('bad-words');
const { generateMessage, generateLocation } = require('./utils/message.js');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js');

const socketIo = require('socket.io');
const io = socketIo(server);


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('Connected to socket!');
    socket.on('roomJoin', (options, callback) => {
        const { error, user } = addUser({id: socket.id, ...options });

        if (error) {
            return callback(error);
        }
        socket.join(options.room);
        socket.emit('chatGroup', generateMessage('Welcome to the chat!'));
        socket.broadcast.to(user.room).emit('chatGroup', generateMessage(`${user.username} has joined!`));

        callback();
    })

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
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('chatGroup', generateMessage(`${user.username} has left the room!`))
        }
    });
});

server.listen(port , () => {
    console.log(`server is up on port ${port}!! `);
})
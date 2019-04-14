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

io.on('connection', () => {
    console.log('New WebSocker connected!');
});

server.listen(port , () => {
    console.log(`server is up on port ${port}!! `);
})
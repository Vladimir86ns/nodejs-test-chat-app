const socket = io();

socket.on('countUpdated', (data) => {
    console.log('count updated : ', data);
});

document.querySelector('#counter').addEventListener('click', (data) => {
    socket.emit('increment');
})
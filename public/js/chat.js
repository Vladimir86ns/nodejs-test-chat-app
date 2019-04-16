const socket = io();

socket.on('chatGroup', (data) => {
    console.log(data);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    };

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        socket.emit('geoLocation', { lat: latitude, long: longitude }, () => {
            console.log('Location has been send!')
        })
    })
});


const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');


socket.on('chatGroup', (data) => {
    console.log(data);
});

$messageForm.addEventListener('submit', (e) => {
    $messageFormButton.setAttribute('disabled', 'disabled');

    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    };

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        socket.emit('geoLocation', { lat: latitude, long: longitude }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location has been send!')
        })
    })
});


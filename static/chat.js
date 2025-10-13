
const socket = io();

socket.on('connect', () => {

    console.log('DEBUG: Connected to server 🔌');

});

socket.on(

    'message',

    (msg) => {

        // REMOVE LATER
        console.log('DEBUG: Message received:', msg);
        
        const messages = document.getElementById('messages');
        const item = document.createElement('li');

        item.textContent = msg;
        messages.appendChild(item);

    }

)

function sendMessage() {
    
    const input = document.getElementById('msg');
    const message = input.value;

    socket.send(message);
    input.value = '';

}
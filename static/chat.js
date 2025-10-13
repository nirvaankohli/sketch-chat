
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
        

    }
)

const socket = io();

socket.on('connect', () => {
    console.log('DEBUG: Connected to server 🔌');
});
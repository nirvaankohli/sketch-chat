const socket = io();

socket.on("connect", () => {
  console.log("DEBUG: Connected to server 🔌");
});

function doesCookieExistOrNot(cookieName, howmanydays, value) {
  if (!getCookie(cookieName)) {
    // REMOVE LATER

    console.log(
      `DEBUG: Cookie "${cookieName}" does not exist. Creating a new one...`
    );

    const d = new Date();
    
    d.setTime(d.getTime() + (howmanydays * 24 * 60 * 60 * 1000));
    
    const expires = "expires=" + d.toUTCString();
    
    document.cookie = cookieName + "=" + value + ";" + expires + ";path=/";


  }
}

socket.on(
  "message",

  (msg) => {
    // REMOVE LATER
    console.log("DEBUG: Message received:", msg);

    const messages = document.getElementById("messages");
    const item = document.createElement("li");

    item.textContent = msg;
    messages.appendChild(item);
  }
);

function sendMessage() {
  const input = document.getElementById("msg");
  const message = input.value;

  socket.send(message);
  input.value = "";
}

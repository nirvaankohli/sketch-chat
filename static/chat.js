const socket = io();

socket.on("connect", () => {
  console.log("DEBUG: Connected to server 🔌");
});

function randomString(length) {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

}

function doesCookieExistOrNot(cookieName, howmanydays, value) {
  if (!getCookie(cookieName)) {
    // REMOVE LATER

    console.log(
      `DEBUG: Cookie "${cookieName}" does not exist. Creating a new one...`
    );

    const d = new Date();

    d.setTime(d.getTime() + howmanydays * 24 * 60 * 60 * 1000);

    const expires = "expires=" + d.toUTCString();

    document.cookie = cookieName + "=" + value + ";" + expires + ";path=/";
    // REMOVE LATER

    console.log(`DEBUG: Cookie "${cookieName}" created with value: ${value}`);
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

doesCookieExistOrNot("user_id", 365, "user_" + randomString(10));

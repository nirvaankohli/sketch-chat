const socket = io();

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    
    for (let i = 0; i < cookieArray.length; i++) {

        let cookie = cookieArray[i];

        while (cookie.charAt(0) === " ") {

            cookie = cookie.substring(1);

        }

        if (cookie.indexOf(name) === 0) {

            return cookie.substring(name.length, cookie.length);
        
        }

    }
    
    return "";
}

socket.on("connect", () => {
  console.log("DEBUG: Connected to server 🔌");
});

function randomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * length));
  }

  return result;
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

  return getCookie(cookieName);
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

  socket.send(
    doesCookieExistOrNot("userId", 365, randomString(16)) + ": " + message
  );
  input.value = "";
}

const userId = doesCookieExistOrNot("userId", 365, randomString(16));

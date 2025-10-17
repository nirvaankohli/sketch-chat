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

const inputField = document.getElementById("msg");
window.getCookie = getCookie;

allowedChars = ["-", ".", " ", "/"];

socket.on("connect", () => {
  console.log("DEBUG: Connected to server 🔌");
});

function randomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function maskUserId() {
  const newId = randomString(16);
  try {
    sessionStorage.setItem("tabUserId", newId);
  } catch (e) {
    console.warn("sessionStorage unavailable, falling back to window scope");
    window._tabUserId = newId;
  }
  window.userId = newId;
  console.log(`DEBUG: Masked (tab-only) userId -> ${newId}`);
}

window.maskUserId = maskUserId;
window.MaskUserId = maskUserId;

function clearTabUserId() {
  try {
    sessionStorage.removeItem("tabUserId");
  } catch (e) {
    delete window._tabUserId;
  }

  const cookieId = doesCookieExistOrNot("userId", 365, randomString(16));

  window.userId = cookieId;

  console.log(
    "DEBUG: Cleared tab user id, now using cookie userId ->",
    cookieId
  );
}

window.clearTabUserId = clearTabUserId;

window.randomString = randomString;

// ---------- friendly name mapping ----------
// Load adjective and noun lists from static files and build a deterministic mapping
window._adjectives = [];
window._nouns = [];

async function loadWordLists() {
  try {
    const [adjResp, nounResp] = await Promise.all([
      fetch("/static/adjectives.txt"),
      fetch("/static/nouns.txt"),
    ]);

    if (adjResp.ok) {
      const text = await adjResp.text();
      window._adjectives = text.split(/\r?\n/).filter(Boolean);
    }

    if (nounResp.ok) {
      const text = await nounResp.text();
      window._nouns = text.split(/\r?\n/).filter(Boolean);
    }

    console.log(
      "DEBUG: Word lists loaded",
      window._adjectives.length,
      window._nouns.length
    );
  } catch (e) {
    console.warn("Could not load word lists for display names", e);
  }
}

function hashStringToInt(s) {
  let h = 2166136261 >>> 0;

  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }

  return h >>> 0;
}

function getDisplayNameFromId(id) {
  if (!id) return id;
  const adjLen = window._adjectives.length;
  const nounLen = window._nouns.length;
  if (adjLen === 0 || nounLen === 0) return id;

  const h = hashStringToInt(id);
  const a = h % adjLen;
  const b = Math.floor(h / adjLen) % nounLen;
  return `${window._adjectives[a]} ${window._nouns[b]}`;
}

window.getDisplayNameFromId = getDisplayNameFromId;
window.getDisplayName = getDisplayNameFromId;

loadWordLists();

function doesCookieExistOrNot(cookieName, howmanydays, value) {
  if (!getCookie(cookieName)) {
    // REMOVE LATER
    console.log(
      `DEBUG: Cookie "${cookieName}" does not exist. Creating a new one...`
    );

    const d = new Date();

    d.setTime(d.getTime() + howmanydays * 24 * 60 * 60 * 1000);

    const expires = "expires=" + d.toUTCString();

    document.cookie =
      cookieName + "=" + value + ";" + expires + ";path=/;SameSite=Strict";

    console.log(`DEBUG: Cookie "${cookieName}" created with value: ${value}`);
  }

  return getCookie(cookieName);
}
window.doesCookieExistOrNot = doesCookieExistOrNot;

socket.on("message", (msg) => {
  const messages = document.getElementById("messages");
  const item = document.createElement("li");

  console.log("DEBUG: Received message:", msg);

  const parts = msg.split(": ");
  const senderId = parts.shift();
  const messageText = parts.join(": ");

  const displayName = window.getDisplayName
    ? window.getDisplayName(senderId)
    : senderId;

  const messageTextElement = document.createElement("div");
  messageTextElement.className = "message-text";
  messageTextElement.textContent = messageText;

  const senderElement = document.createElement("div");
  senderElement.className = "message-sender";
  senderElement.textContent = displayName;

  item.appendChild(messageTextElement);
  messages.appendChild(senderElement);
  item.title = senderId;

  if (window.userId === senderId) {
    item.className = "msg--me";
  } else {
    item.className = "msg--other";
  }

  messages.appendChild(item);

  messages.scrollTop = messages.scrollHeight;
});

function sendMessage() {
  const input = document.getElementById("msg");
  const message = input.value.trim();

  console.log("DEBUG: Sending message:", message);

  if (!message) return; // Don't send empty messages

  let senderId = null;
  try {
    senderId = sessionStorage.getItem("tabUserId");
  } catch (e) {
    senderId = window._tabUserId || null;
  }
  if (!senderId) {
    senderId = doesCookieExistOrNot("userId", 365, randomString(16));
  }

  socket.send(senderId + ": " + message);
  input.value = "";
}
window.sendMessage = sendMessage;

let initialTabId = null;
try {
  initialTabId = sessionStorage.getItem("tabUserId");
} catch (e) {
  initialTabId = window._tabUserId || null;
}

if (initialTabId) {
  window.userId = initialTabId;
} else {
  const userId = doesCookieExistOrNot("userId", 365, randomString(16));
  window.userId = userId;
}

document.getElementById("msg").addEventListener("keypress", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  } else if (!allowedChars.includes(e.key)) {
    e.preventDefault();
  }
});

function inputKeyboard(char) {
  inputField.value += char;
}

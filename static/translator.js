const MORSE_CODE_MAP = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "/": "-..-.",
  " ": "/",
};

const REVERSE_MORSE_CODE_MAP = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([k, v]) => [v, k])
);

function textToMorse(text) {
  try {
    return text
      .toLowerCase()
      .split("")
      .map((char) => MORSE_CODE_MAP[char] || char)
      .join(" ");
  } catch (error) {
    return "Error";
  }
}

function morseToText(morse) {
  try {
    return morse
      .split(" ")
      .map((char) => REVERSE_MORSE_CODE_MAP[char] || char)
      .join(" ");
  } catch (error) {
    return "Error";
  }
}

function translateToMorse() {
  const inputField = document.getElementById("inputText");
  const outputField = document.getElementById("morseCode");

  output = textToMorse(inputField.value);

  if (output === "Error") {
    outputField.value =
      "Translation Error - You most likely used unsupported characters.";
  } else {
    outputField.value = output;
  }
}

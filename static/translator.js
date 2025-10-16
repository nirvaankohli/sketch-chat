var morseToEnglish = true;
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
  "'": ".----.",
  "!": "-.-.--",
  "&": ".-...",
  "-": "-....-",
};

const REVERSE_MORSE_CODE_MAP = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([k, v]) => [v, k])
);

const inputField = document.getElementById("inputText");

inputField.addEventListener("input", function (event) {
  if (morseToEnglish) {
    translateToMorse();
  } else {
    translateToEnglish();
  }
});

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
      .join("");
  } catch (error) {
    return "Error";
  }
}

function translateToMorse() {
  const inputField = document.getElementById("inputText");
  const outputField = document.getElementById("morseCode");

  output = textToMorse(inputField.value);

  var hasUnsupportedChars = inputField.value
    .toLowerCase()
    .split("")
    .some((char) => !(char in MORSE_CODE_MAP));

  if (hasUnsupportedChars) {
    outputField.value =
      "Translation Error - You most likely used unsupported characters.";
  } else {
    outputField.value = output;
  }
}

function translateToEnglish() {
  const inputField = document.getElementById("inputText");
  const outputField = document.getElementById("morseCode");

  output = morseToText(inputField.value);
  var SupportedChars = [" ", "/", ".", "-"];
  var hasUnsupportedChars = inputField.value
    .toLowerCase()
    .split("")
    .some((char) => !SupportedChars.includes(char));
  if (hasUnsupportedChars) {
    outputField.value =
      "Translation Error - You most likely used unsupported characters.";
  } else {
    outputField.value = output;
  }
}

function switchTranslation() {
  if (!morseToEnglish) {
    morseToEnglish = true;
  } else {
    morseToEnglish = false;
  }

  const inputField = document.getElementById("inputText");
  const outputField = document.getElementById("morseCode");

  inputField.value = "";
  outputField.value = "";

  if (morseToEnglish) {
    translateToMorse();
  } else {
    translateToEnglish();
  }

  const label_container = document.getElementById("container-label");
  var text_label = document.getElementById("englishLabel");
  var morse_label = document.getElementById("morseCodeLabel");

  text_label.remove();
  morse_label.remove();

  text_label = document.createElement("h3");
  text_label.id = "englishLabel";
  text_label.textContent = "English";

  morse_label = document.createElement("h3");
  morse_label.id = "morseCodeLabel";
  morse_label.textContent = "Morse Code";

  if (morseToEnglish) {
    label_container.appendChild(text_label);
    label_container.appendChild(morse_label);
  } else {
    label_container.appendChild(morse_label);
    label_container.appendChild(text_label);
  }
}

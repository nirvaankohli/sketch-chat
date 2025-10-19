from cgitb import text
from flask import Flask, jsonify, request, render_template
from flask_socketio import SocketIO, send
from dotenv import load_dotenv
import os

morse_code_map = {
    "a": ".-",
    "b": "-...",
    "c": "-.-.",
    "d": "-..",
    "e": ".",
    "f": "..-.",
    "g": "--.",
    "h": "....",
    "i": "..",
    "j": ".---",
    "k": "-.-",
    "l": ".-..",
    "m": "--",
    "n": "-.",
    "o": "---",
    "p": ".--.",
    "q": "--.-",
    "r": ".-.",
    "s": "...",
    "t": "-",
    "u": "..-",
    "v": "...-",
    "w": ".--",
    "x": "-..-",
    "y": "-.--",
    "z": "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "/": "-..-.",
    " ": "/",
    "'": ".----.",
    "!": "-.-.--",
    "&": ".-...",
    "-": "-....-",
}

morse_code_allowed = [".", "-", " ", "/"]
text_allowed = list(morse_code_map.keys()) + [" "]

reverse_morse_code_map = {v: k for k, v in morse_code_map.items()}

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app, cors_allowed_origins="*")


def contains_only_allowed_chars(string, allowed_chars):

    allowed_set = set(allowed_chars)

    for char in string:

        if char not in allowed_set:

            return False

    return True


def morse_to_text(morse_code):

    words = morse_code.split(" / ")

    decoded_message = ""

    for word in words:

        letters = word.split(" ")

        for letter in letters:

            decoded_message += reverse_morse_code_map.get(letter, "")

        decoded_message += " "

    return decoded_message.strip()


def text_to_morse(text):

    text = text.lower().strip()

    words = text.split(" ")

    morse_code = "'"

    for word in words:

        for letter in word:

            morse_code += morse_code_map.get(letter, "") + " "

    morse_code += "/ "

    return morse_code.strip()


@app.route("/", methods=["GET"])
def home():

    # Home Morse Code Chat

    return render_template("index.html")


@app.route("/morsecodetranslator", methods=["GET"])
def morse_code_translator():

    return render_template("morse-code-example.html")


@app.route("/api/v1/health", methods=["GET"])
def health_check():

    return jsonify({"status": "ok"}), 200


@app.route("/api/v1/morse-to-text", methods=["POST"])
def api_morse_to_text():
    r""" 

    Curl Example:

    curl -X POST http://<website_url>/api/v1/morse-to-text \
        -H "Content-Type: application/json" \
        -d '{"morse_code": "... --- ..."}'

    Morse Code can only contain the following characters: . - / (space)

    """

    data = request.get_json()
    print(f"Received Data: {data}")

    morse_code = data["morse"].strip()

    print(f"Received morse_code: {morse_code}")

    if not morse_code:

        return (
            jsonify(
                {
                    "error": "Morse Code is required. We do not accept empty values(You didn't supply the morse code data)."
                }
            ),
            400,
        )

    if not contains_only_allowed_chars(morse_code, morse_code_allowed):

        return (jsonify({"error": "Invalid Morse Code"}), 400)

    text = morse_to_text(morse_code)
    print(f"Decoded text: {text}")
    return jsonify({"text": text}), 200


@app.route("/api/v1/text-to-morse", methods=["POST"])
def api_text_to_morse():
    r""" 
    
    Curl Example:

    curl -X POST http://<website_url>/api/v1/text-to-morse \
        -H "Content-Type: application/json" \
        -d '{"text": "translate this"}'

    Text can only contain the following characters: a-z 0-9 . , ? / ' ! & - (space)

    """

    data = request.get_json()
    text = data["text"].strip()

    if not text:

        return (
            jsonify(
                {
                    "error": "Text is required. We do not accept empty values(You didn't supply the text data)."
                }
            ),
            400,
        )

    if not contains_only_allowed_chars(text.lower(), text_allowed):

        return jsonify({"error": "Invalid Text"}), 400

    morse_code = text_to_morse(text)

    return jsonify({"morse_code": morse_code}), 200


@socketio.on("message")
def handle_message(msg):

    print(f"Received message: {msg}")
    send(msg, broadcast=True)


if __name__ == "__main__":

    socketio.run(app, debug=True)

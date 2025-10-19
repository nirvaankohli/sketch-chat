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

    morse_code = morse_code.strip()

    words = [word.strip() for word in morse_code.split("/")]

    decoded_message = ""

    for word in words:
        if not word:
            continue

        letters = [letter.strip() for letter in word.split()]

        for letter in letters:
            if letter:
                decoded_message += reverse_morse_code_map.get(letter, "")

        decoded_message += " "

    return decoded_message.strip()


def text_to_morse(text):
    text = text.lower().strip()
    words = text.split()
    morse_words = []

    for word in words:
        morse_letters = []
        for letter in word:
            morse = morse_code_map.get(letter, "")
            if morse:
                morse_letters.append(morse)

        if morse_letters:
            morse_words.append(" ".join(morse_letters))

    return " / ".join(morse_words)


@app.route("/", methods=["GET"])
def home():

    return render_template("index.html")


@app.route("/morsecodetranslator", methods=["GET"])
def morse_code_translator():

    return render_template("morse-code-example.html")


@app.route("/api/v1/health", methods=["GET"])
def health_check():

    return jsonify({"status": "ok"}), 200


@app.route("/api/v1/morse-to-text", methods=["POST"])
def api_morse_to_text():
    """Translate Morse code to text.

    Expects JSON input with 'morse' key containing Morse code.
    Returns JSON with 'text' key containing translated text.
    """
    try:
        data = request.get_json()

        if not data or "morse" not in data:
            return jsonify({"error": "Missing morse code data"}), 400

        morse_code = data["morse"].strip()

        if not morse_code:
            return jsonify({"error": "Empty morse code"}), 400

        if not contains_only_allowed_chars(morse_code, morse_code_allowed):
            return jsonify({"error": "Invalid characters in Morse code"}), 400

        text = morse_to_text(morse_code)
        if not text:
            return jsonify({"error": "Could not translate Morse code"}), 400

        return jsonify({"text": text}), 200

    except Exception as e:
        return jsonify({"error": "Server error while processing request"}), 500


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
else:
    socketio = SocketIO(
        app, async_mode="eventlet", cors_allowed_origins="*", ping_timeout=30
    )

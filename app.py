from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send
from pythondotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/", methods=["GET"])
def home():

    return "Welcome to chatting app thing!"

@socketio.on("message")
def handle_message(msg):

    print("Ts is Message 📨 " + msg)
    send(msg, broadcast=True)


if __name__ == "__main__":

    socketio.run(app, debug=True)

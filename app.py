from flask import Flask, jsonify, request, render_template
from flask_socketio import SocketIO, send
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/", methods=["GET"])
def home():

    return render_template("index.html")


@socketio.on("message")
def handle_message(msg):

    print("Ts is Message 📨 " + msg)
    send(msg, broadcast=True)


if __name__ == "__main__":

    socketio.run(app, debug=True)

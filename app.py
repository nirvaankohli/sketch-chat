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


if __name__ == "__main__":

    app.run(debug=True)

from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():

    return "Welcome to chatting app thing!"


if __name__ == "__main__":

    app.run(debug=True)

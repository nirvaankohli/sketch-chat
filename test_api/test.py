import requests

BASE_URL = "http://127.0.0.1:5000/"
ROOT = BASE_URL + "api/v1/"


def test_health_check():

    response = requests.get(ROOT + "health")

    return response.text


def test_morse_to_text(data):

    response = requests.post(ROOT + "morse-to-text", json=data)

    return response.json()


def test_text_to_morse(data):

    response = requests.post(ROOT + "text-to-morse", json=data)

    return response.json()


morse_code = """

-.-- --- ..- / .-- .- -. -. .- / .--. .. -.-. -.- / -- . / ..- .--. --..-- / -.-- --- ..- / .-- .- -. -. .- / -... . / -- -.-- / ..-. .-. .. . -. -.. .-.-.-

"""

to_test = ["health_check", "morse_to_text", "text_to_morse"]

if "health_check" in to_test:

    print(test_health_check())

if "morse_to_text" in to_test:

    data = {"morse_code": morse_code}

    print(test_morse_to_text(data))

if "text_to_morse" in to_test:

    data = {"text": "you wanna pick me up, you wanna be my friend."}

    print(test_text_to_morse(data))

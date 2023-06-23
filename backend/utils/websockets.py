import json, os
from websockets.sync.client import connect
from flask import abort

def send_message(type: str, payload=None):
    try:
        with connect(f'ws://{os.getenv("WEBSOCKET_ORIGIN")}:{os.getenv("WEBSOCKET_PORT")}') as websocket:
            message = {
                'type': type,
                'payload': payload
            }

            websocket.send(json.dumps(message))

            data = json.loads(websocket.recv())
            if 'error' in data:
                abort(data['error'], data['message'])

            return data['response']
    except:
        pass
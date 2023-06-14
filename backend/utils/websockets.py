import websockets, json, os
from flask import abort

async def send_message(type: str, payload=None):
    async with websockets.connect(f'ws://{os.getenv("WEBSOCKET_ORIGIN")}:{os.getenv("WEBSOCKET_PORT")}') as websocket:
        message = {
            'type': type,
            'payload': payload
        }

        await websocket.send(json.dumps(message))

        data = json.loads(await websocket.recv())
        if 'error' in data:
            abort(data['error'], data['message'])

        return data['response']
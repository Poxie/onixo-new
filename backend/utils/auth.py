import requests, websockets, os, json
from flask import abort, request
from functools import wraps
from utils.websockets import send_message

def get_access_token(headers):
    if 'Authorization' not in headers:
        abort(400, 'Access token is required')
    
    auth_header = headers['Authorization'].split(' ')
    if len(auth_header) < 2:
        abort(400, 'Access token is required')
    
    access_token = auth_header[1]
    return access_token

def check_admin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        access_token = get_access_token(request.headers)

        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        res = requests.get(f'https://discord.com/api/v10/users/@me', headers=headers)
        user = res.json()
        if not user:
            abort(404, 'User was not found')

        is_admin = send_message(
            type='CONFIRM_ADMIN',
            payload={
                'guild_id': kwargs['guild_id'],
                'user_id': int(user['id']),
            }
        )
        if not is_admin:
            abort(401, 'Unauthorized.')

        kwargs['user_id'] = user['id']
        return f(*args, **kwargs)

    return decorator
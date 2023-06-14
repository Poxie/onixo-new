import os, requests
from flask import Blueprint, request, jsonify, abort

auth = Blueprint('auth', __name__)

API_ENDPOINT = os.getenv('API_ENDPOINT')

@auth.post('/auth')
def exchance_code():
    code = request.form.get('code')
    if not code:
        return 400, 'Code is required'
    
    data = {
        'client_id': os.getenv('CLIENT_ID'),
        'client_secret': os.getenv('CLIENT_SECRET'),
        'redirect_uri': os.getenv('REDIRECT_URI'),
        'grant_type': 'authorization_code',
        'code': code
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    r = requests.post(f'{API_ENDPOINT}/oauth2/token', data=data, headers=headers)
    return r.json()

@auth.post('/refresh')
def refresh_token_route():
    refresh_token = request.form.get('refresh_token')
    if not refresh_token:
        abort(400, 'Refresh token is required')

    data = {
        'client_id': os.getenv('CLIENT_ID'),
        'client_secret': os.getenv('CLIENT_SECRET'),
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    r = requests.post(f'{API_ENDPOINT}/oauth2/token', data=data, headers=headers)
    response = r.json()

    if 'error' in response:
        abort(401, response['error'])
    
    return jsonify(response)
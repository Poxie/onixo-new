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
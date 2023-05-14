from flask import abort

def get_access_token(headers):
    if 'Authorization' not in headers:
        abort(400, 'Access token is required')
    
    auth_header = headers['Authorization'].split(' ')
    if len(auth_header) < 2:
        abort(400, 'Access token is required')
    
    access_token = auth_header[1]
    return access_token
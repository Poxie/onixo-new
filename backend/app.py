import os, requests, chargebee
from database import database
from flask import Flask
from flask import request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from blueprints.auth import auth
from blueprints.guilds import guilds
from blueprints.webhooks import webhooks
from blueprints.subscriptions import subscriptions
from utils.constants import SUBSCRIPTION_DENIED, SUBSCRIPTION_ACCEPTED

from dotenv import load_dotenv
load_dotenv()

chargebee.configure(os.getenv('CHARGEBEE_API_KEY'), os.getenv('CHARGEBEE_SITE'))

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins=os.getenv('FRONTEND_ORIGIN'))

CORS(app, resources={r'/*': {'origins': os.getenv('FRONTEND_ORIGIN')}})

app.register_blueprint(auth)
app.register_blueprint(guilds)
app.register_blueprint(webhooks)
app.register_blueprint(subscriptions)


clients = {}
@socketio.on('connect')
def on_connect(auth):
    if not auth or not 'token' in auth:
        return
    
    token = auth['token']

    headers = {
        'Authorization': f'Bearer {token}'
    }
    r = requests.get(f'{os.getenv("API_ENDPOINT")}/users/@me', headers=headers)
    
    user = r.json()
    user_id = user['id']
    socket_id = request.sid

    clients[socket_id] = user_id

@socketio.on('disconnect')
def on_disconnect():
    del clients[request.sid]

@socketio.on('CONFIRM_PAYMENT')
def confirm_payment(data):
    if not 'hosted_page_id' in data or not 'guild_id' in data:
        return
    
    guild_id = data['guild_id']
    hosted_page_id = data['hosted_page_id']

    try:
        result = chargebee.HostedPage.retrieve(hosted_page_id)
    except Exception as e:
        return emit(SUBSCRIPTION_DENIED, 'No subscription was found.', room=request.sid)
    
    # Checking if hosted page payment has succeeded
    if result.hosted_page.state != 'succeeded':
        return emit(SUBSCRIPTION_DENIED, 'No subscription was found.', room=request.sid)
    
    # Checking if subscription has already been used
    db = database['subscriptions']
    subscription = db.find_one({ 'hosted_page_id': hosted_page_id })
    if subscription:
        return emit(SUBSCRIPTION_DENIED, 'This subscription has already been used.', room=request.sid)
    
    # Adding premium to guild
    settings = database['settings']
    settings.update_one({
        '_id': int(guild_id)
    }, {
        '$set': {
            'premium': 1
        }
    })
    
    # Adding subscription to database to prevent multiple uses
    db.insert_one(dict(
        guild_id=guild_id,
        hosted_page_id=hosted_page_id,
        subscription_id=result.hosted_page.content.subscription.id
    ))

    emit(SUBSCRIPTION_ACCEPTED, None, room=request.sid)

if __name__ == '__main__':
    socketio.run(app)
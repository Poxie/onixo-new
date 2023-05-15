import os, requests
from database import database
from flask import Blueprint, request, jsonify, abort
from utils.auth import get_access_token

guilds = Blueprint('guilds', __name__)

API_ENDPOINT = os.getenv('API_ENDPOINT')
ADMIN_PERMS = 0x0000000000000008

@guilds.get('/guilds')
def get_bot_guilds():
    # Fetching bot guilds
    db = database['settings']
    
    guilds = db.find()
    guild_ids = [int(guild['_id']) for guild in guilds]

    # Fetching user guilds
    access_token = get_access_token(request.headers)

    headers = {'Authorization': f'Bearer {access_token}'}
    r = requests.get(f'{API_ENDPOINT}/users/@me/guilds', headers=headers)
    user_guilds = r.json()
    
    admin_guilds = []
    for guild in user_guilds:
        if (int(guild['permissions']) & ADMIN_PERMS) == ADMIN_PERMS:
            guild['invited'] = int(guild['id']) in guild_ids  
            admin_guilds.append(guild)

    return jsonify(admin_guilds)

@guilds.get('/guilds/<int:guild_id>/automod')
def get_guild_automod(guild_id: int):
    db = database['settings']

    # Fetching guild's bot settings
    settings = db.find_one({ '_id': guild_id })
    if not settings:
        return 404, 'Guild not found'
    
    # Converting antilink numbers to booleans
    antilink = {}
    for key, val in settings['antilink'].items():
        antilink[key] = bool(val)

    # Creating a dict with automod values to return
    automod_settings = {
        'guild_id': str(guild_id),
        'antilink': antilink
    }

    return jsonify(automod_settings)
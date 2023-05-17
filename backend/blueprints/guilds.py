import os, requests
from database import database
from utils.constants import ALLOWED_ANTILINK_SITES, ALLOWED_LOGGING_ACTIONS
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

@guilds.get('/guilds/<int:guild_id>/channels')
def get_guild_channels(guild_id: int):
    headers = {'Authorization': f'Bot {os.getenv("BOT_TOKEN")}'}
    r = requests.get(f'{API_ENDPOINT}/guilds/{guild_id}/channels', headers=headers)
    channels = r.json()

    text_channels = [channel for channel in channels if channel['type'] == 0]

    return jsonify(text_channels)

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

@guilds.patch('/guilds/<int:guild_id>/antilink')
def update_guild_antilink(guild_id: int):
    db = database['settings']

    property = request.form.get('property')
    value = request.form.get('value')

    if not property or not value:
        abort(400, 'Property or value is missing')
    
    if property not in ALLOWED_ANTILINK_SITES:
        abort(400, 'Unsupported site')
    
    if value != 'custom':
        if value not in ['false', 'true']:
            abort(400, 'Value must be a boolean')

        value = value == 'true'
    else:
        try:
            value = list(value)
        except:
            abort(400, 'Value must be a list')

    db.update_one({ '_id': guild_id }, {
        '$set': {
            f'antilink.{property}': value
        }
    })

    return jsonify({})

@guilds.get('/guilds/<int:guild_id>/action-logs')
def get_action_logs(guild_id: int):
    db = database['logging']

    logging_channels = db.find_one({ '_id': guild_id })

    channels = {}
    for key, value in logging_channels.items():
        if key == '_id': continue

        if value:
            channels[key] = [str(value[0]), value[1], value[2]]
        else:
            channels[key] = [None, None, None]

    return jsonify(channels)

@guilds.patch('/guilds/<int:guild_id>/action-logs')
def update_action_logs(guild_id: int):
    db = database['logging']

    action = request.form.get('action')
    channel_id = request.form.get('channel_id')

    if not action:
        abort(400, 'action is required properties')

    if action not in ALLOWED_LOGGING_ACTIONS:
        abort(400, 'action is unsupported')

    try:
        if channel_id != 'null':
            channel_id = int(channel_id)
        else:
            channel_id = None
    except:
        abort(400, 'channel_id must be an integer')

    # Determining log key
    if action == 'all':
        key = 'all_logs_channel'
    else:
        key = f'{action}_log_channel'

    # Removing previous webhook
    cursor = db.find_one({ '_id': guild_id })
    prev_action = cursor[f'{key}']

    if prev_action and len(prev_action) >= 2:
        prev_channel_id = prev_action[0]
        prev_webhook_id = prev_action[1]
        prev_webhook_token = prev_action[2]

        r = requests.delete(f'{API_ENDPOINT}/webhooks/{prev_webhook_id}/{prev_webhook_token}')

    # Creating new webhook for new channel
    if channel_id:
        headers = {
            'Authorization': f'Bot {os.getenv("BOT_TOKEN")}',
            'Content-Type': 'application/json'
        }
        data = {
            'name': 'Onixo'
        }
        r2 = requests.post(f'{API_ENDPOINT}/channels/{channel_id}/webhooks', json=data, headers=headers)
        data = r2.json()

        webhook_id = data['id']
        webhook_token = data['token']

        # Updating db with new webhook and channel
        db.update_one({ '_id': guild_id }, {
            '$set': {
                f'{key}': [channel_id, webhook_id, webhook_token]
            }
        })
    else:
        # Resetting log channel
        db.update_one({ '_id': guild_id }, {
            '$set': {
                f'{key}': None
            }
        })

    # Getting new channel/webhook id and token
    new_settings = db.find_one({ '_id': guild_id })
    new_action_settings = new_settings[key]
    if new_action_settings:
        new_action_settings[0] = str(new_action_settings[0])

    return jsonify(new_action_settings)
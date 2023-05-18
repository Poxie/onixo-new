import os, requests
from database import database
from utils.constants import ALLOWED_ANTILINK_SITES, ALLOWED_LOGGING_ACTIONS, ALLOWED_MOD_SETTINGS_PROPERTIES
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
    if logging_channels:
        for key, value in logging_channels.items():
            if key == '_id': continue

            if value:
                channels[key] = str(value[0])
            else:
                channels[key] = None
    else:
        for action in ['all', 'ban', 'kick', 'warn', 'mute']:
            key = f'{action}_logs_channel' if action == 'all' else f'{action}_log_channel'
            channels[key] = None

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
    log_settings = db.find_one({ '_id': guild_id })

    # If server has not used logging previous, create first instance
    if not log_settings:
        new_logging_settings = {'_id': guild_id}
        for action in ALLOWED_LOGGING_ACTIONS:
            if action == 'all':
                new_logging_settings[f'{action}_logs_channel'] = []
            else:
                new_logging_settings[f'{action}_log_channel'] = []

        # Inserting initial logging object
        db.insert_one(new_logging_settings)

        # After creating, update with newly created settings
        log_settings = db.find_one({ '_id': guild_id })

    # Updating correct log setting
    if log_settings[f'{key}'] and len(log_settings[f'{key}']) >= 2:
        prev_action = log_settings[f'{key}']
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
                f'{key}': []
            }
        })

    # Getting new channel id
    new_settings = db.find_one({ '_id': guild_id })
    new_action_settings = new_settings[key]

    # Getting new channel_id
    new_channel_id = None
    if new_action_settings and len(new_action_settings) >= 2:
        new_channel_id = str(new_action_settings[0])

    return jsonify(new_channel_id)

@guilds.get('/guilds/<int:guild_id>/mod-settings')
def get_guild_mod_settings(guild_id: int):
    db = database['settings']

    settings = db.find_one({ '_id': guild_id })
    mod_settings = settings['moderation']

    if mod_settings:
        for key, value in mod_settings.items():
            mod_settings[key] = bool(value)

    return jsonify(mod_settings)

@guilds.patch('/guilds/<int:guild_id>/mod-settings')
def update_guild_mod_settings(guild_id: int):
    db = database['settings']

    property = request.form.get('property')
    value = request.form.get('value')

    if not property or not value:
        abort(400, 'Property and value are required')

    if property not in ALLOWED_MOD_SETTINGS_PROPERTIES:
        abort(400, 'Unsupported property')

    if value not in ['true', 'false']:
        abort(400, 'Unsupported value')

    value = value == 'true'

    db.update_one({ '_id': guild_id }, {
        '$set': {
            f'moderation.{property}': value
        }
    })

    return jsonify({})
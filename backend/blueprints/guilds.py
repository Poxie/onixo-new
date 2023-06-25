import os, requests, json, base64
from database import database
from operator import itemgetter
from utils.constants import GET_TOP_ROLE, ALLOWED_ANTILINK_SITES, ALLOWED_LOGGING_ACTIONS, ALLOWED_MOD_SETTINGS_PROPERTIES, SEND_EMBED, ALLOWED_WELCOME_PROPERTIES, ALLOWED_GOODBYE_PROPERTIES, AUTO_ROLE_PROPERTIES, GET_INFRACTIONS, ALLOWED_INFRACTION_PROPERTIES
from flask import Blueprint, request, jsonify, abort
from utils.auth import get_access_token, check_admin
from utils.websockets import send_message

guilds = Blueprint('guilds', __name__)

API_ENDPOINT = os.getenv('API_ENDPOINT')
ADMIN_PERMS = 0x0000000000000020

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
    
    # If we are being rate limited
    if 'retry_after' in user_guilds:
        abort(429, {'retry_after': user_guilds['retry_after']})

    admin_guilds = []
    for guild in user_guilds:
        if (int(guild['permissions']) & ADMIN_PERMS) == ADMIN_PERMS:
            guild['invited'] = int(guild['id']) in guild_ids  
            admin_guilds.append(guild)

    # Sorting guilds based on invited property
    admin_guilds = sorted(admin_guilds, key=itemgetter('invited'), reverse=True)

    return jsonify(admin_guilds)

@guilds.get('/guilds/<int:guild_id>/channels')
@check_admin
def get_guild_channels(guild_id: int, user_id: int):
    headers = {'Authorization': f'Bot {os.getenv("BOT_TOKEN")}'}
    r = requests.get(f'{API_ENDPOINT}/guilds/{guild_id}/channels', headers=headers)
    channels = r.json()

    text_channels = [channel for channel in channels if channel['type'] == 0]

    return jsonify(text_channels)

@guilds.get('/guilds/<int:guild_id>/roles')
@check_admin
def get_guild_roles(guild_id: int, user_id: int):
    headers = {'Authorization': f'Bot {os.getenv("BOT_TOKEN")}'}
    r = requests.get(f'{API_ENDPOINT}/guilds/{guild_id}/roles', headers=headers)
    roles = r.json()

    # Checking what is the highest role for the bot
    highest_role = send_message(GET_TOP_ROLE, { 'guild_id': guild_id })

    # Preventing roles of highest role or above to be displayed
    filtered_roles = []
    for role in roles:
        if role['position'] < highest_role['position'] and not role['managed']:
            filtered_roles.append(role)

    # Sorting based on position
    sorted_roles = sorted(filtered_roles, key=itemgetter('position'), reverse=True)

    return jsonify(sorted_roles)

@guilds.get('/guilds/<int:guild_id>/anti-link')
@check_admin
def get_guild_anti_link(guild_id: int, user_id: int):
    db = database['settings']

    # Fetching guild's bot settings
    settings = db.find_one({ '_id': guild_id })
    if not settings:
        return 404, 'Guild not found'
    
    # Converting antilink numbers to booleans
    antilink = {}
    for key, val in settings['antilink'].items():
        antilink[key] = bool(val)

    return jsonify(antilink)

@guilds.patch('/guilds/<int:guild_id>/anti-link')
@check_admin
def update_guild_antilink(guild_id: int, user_id: int):
    db = database['settings']

    for prop, val in request.form.items():
        if prop not in ALLOWED_ANTILINK_SITES:
            continue

        db.update_one({ '_id': guild_id }, {
            '$set': {
                f'antilink.{prop}': 0 if val == 'false' else 1
            }
        })

    # Fetching updated settings
    settings = db.find_one({ '_id': guild_id })
    antilink = settings['antilink']

    return jsonify(antilink)

@guilds.get('/guilds/<int:guild_id>/action-logs')
@check_admin
def get_action_logs(guild_id: int, user_id: int):
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
        for action in ALLOWED_LOGGING_ACTIONS:
            channels[action] = None

    return jsonify(channels)


@guilds.patch('/guilds/<int:guild_id>/action-logs')
@check_admin
def update_action_logs(guild_id: int, user_id: int):
    db = database['logging']
    log_settings = db.find_one({ '_id': guild_id })

    # If server has not used logging previous, create first instance
    if not log_settings:
        new_logging_settings = {'_id': guild_id}
        for action in ALLOWED_LOGGING_ACTIONS:
            new_logging_settings[action] = []

        # Inserting initial logging object
        db.insert_one(new_logging_settings)

    # Updating channgels
    for action, channel_id in request.form.items():
        if action not in ALLOWED_LOGGING_ACTIONS:
            continue

        # Updating correct log setting
        if log_settings[action] and len(log_settings[action]) >= 2:
            prev_action = log_settings[action]
            prev_channel_id = prev_action[0]
            prev_webhook_id = prev_action[1]
            prev_webhook_token = prev_action[2]

            r = requests.delete(f'{API_ENDPOINT}/webhooks/{prev_webhook_id}/{prev_webhook_token}')

        # Creating new webhook for new channel
        if channel_id != 'null':
            headers = {
                'Authorization': f'Bot {os.getenv("BOT_TOKEN")}',
                'Content-Type': 'application/json'
            }
            data = {
                'name': 'Onixo'
            }
            r2 = requests.post(f'{API_ENDPOINT}/channels/{channel_id}/webhooks', json=data, headers=headers)
            data = r2.json()

            # If we are being ratelimited
            if 'retry_after' in data:
                abort(429, {'retry_after': data['retry_after']})

            webhook_id = data['id']
            webhook_token = data['token']

            # Updating db with new webhook and channel
            db.update_one({ '_id': guild_id }, {
                '$set': {
                    f'{action}': [int(channel_id), webhook_id, webhook_token]
                }
            })
        else:
            # Resetting log channel
            db.update_one({ '_id': guild_id }, {
                '$set': {
                    f'{action}': []
                }
            })

    # Fetching new settings
    new_settings = db.find_one({ '_id': guild_id })
    
    channels = {}
    if new_settings:
        for key, value in new_settings.items():
            if key == '_id': continue

            if value:
                channels[key] = str(value[0])
            else:
                channels[key] = None
    else:
        for action in ALLOWED_LOGGING_ACTIONS:
            channels[action] = None

    return jsonify(channels)

@guilds.get('/guilds/<int:guild_id>/mod-settings')
@check_admin
def get_guild_mod_settings(guild_id: int, user_id: int):
    db = database['settings']

    settings = db.find_one({ '_id': guild_id })
    mod_settings = settings['moderation']

    if mod_settings:
        for key, value in mod_settings.items():
            mod_settings[key] = bool(value)

    return jsonify(mod_settings)

@guilds.patch('/guilds/<int:guild_id>/mod-settings')
@check_admin
def update_guild_mod_settings(guild_id: int, user_id: int):
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

@guilds.post('/guilds/<int:guild_id>/embeds')
@check_admin
def send_embed(guild_id: int, user_id: int):
    channel_id = request.form.get('channel_id')
    embed = request.form.get('embed')

    if not channel_id:
        abort(400, 'channel_id is required')

    if not embed:
        abort(400, 'embed is required')

    send_message(
        type=SEND_EMBED, 
        payload=({
            'user_id': user_id,
            'channel_id': channel_id,
            'embed': json.loads(embed)
        })
    )

    return jsonify({})

@guilds.get('/guilds/<int:guild_id>/welcome')
@check_admin
def get_welcome_settings(guild_id: int, user_id: int):
    db = database['settings']

    settings = db.find_one({ '_id': guild_id })
    welcome = settings['welcome']
    auto_role = settings['autorole']

    welcome['channel'] = str(welcome['channel'][0]) if len(welcome['channel']) > 0 else None
    welcome['isEnabled'] = bool(welcome['isEnabled'])
    welcome['users'] = [str(id) for id in auto_role['users']]
    welcome['bots'] = [str(id) for id in auto_role['bots']]

    return jsonify(welcome)

@guilds.patch('/guilds/<int:guild_id>/welcome')
@check_admin
def update_welcome_setting(guild_id: int, user_id: int):
    settings = database['settings']
    properties = request.form.items()

    for property in properties:
        # If property is auto role
        if property[0] in AUTO_ROLE_PROPERTIES:
            try:
                roles = json.loads(property[1])
            except:
                abort(400, f'{property[0]} value must be a list of strings.')

            settings.update_one({ '_id': guild_id }, {
                '$set': {
                    f'autorole.{property[0]}': [int(id) for id in roles]
                }
            })

        # Making sure not to update unwanted values
        if property[0] not in ALLOWED_WELCOME_PROPERTIES:
            continue

        # Special interaction is needed if channel should update
        if property[0] == 'channel':
            guild = settings.find_one({ '_id': guild_id })
            channel = guild['welcome']['channel']
            
            # If previous channel, remove current webhook
            if len(channel) >= 2:
                r = requests.delete(f'{API_ENDPOINT}/webhooks/{channel[1]}/{channel[2]}')

            # If new channel is selected
            if property[1] != 'null':
                # Creating encoded onixo avatar
                dir = os.path.join(os.path.dirname(__file__), '../assets/avatars/onixo.png')
                binary = open(dir, 'rb').read()
                base64_str = base64.b64encode(binary).decode('utf-8')
                data_url = f'data:image/png;base64,{base64_str}'

                # Create new webhook for channel
                headers = {
                    'Authorization': f'Bot {os.getenv("BOT_TOKEN")}',
                    'Content-Type': 'application/json'
                }
                data = {
                    'name': 'Onixo',
                    'avatar': data_url
                }
                r2 = requests.post(f'{API_ENDPOINT}/channels/{property[1]}/webhooks', json=data, headers=headers)
                webhook = r2.json()
                print(webhook)

                # Update database with new webhook data
                settings.update_one({ '_id': guild_id }, {
                    '$set': {
                        f'welcome.channel': [int(property[1]), webhook['id'], webhook['token']]
                    }
                })
            
            # Else if new channel is none
            else:
                # Update database with new webhook data
                settings.update_one({ '_id': guild_id }, {
                    '$set': {
                        f'welcome.channel': []
                    }
                })

        # Else just update the database with the values
        else:
            settings.update_one({ '_id': guild_id }, {
                '$set': {
                    f'welcome.{property[0]}': property[1]
                }
            })

    return jsonify({})

@guilds.get('/guilds/<int:guild_id>/goodbye')
@check_admin
def get_goodbye_settings(guild_id: int, user_id: int):
    db = database['settings']

    settings = db.find_one({ '_id': guild_id })
    goodbye = settings['goodbye']

    goodbye['channel'] = str(goodbye['channel'][0]) if len(goodbye['channel']) > 0 else None
    goodbye['isEnabled'] = bool(goodbye['isEnabled'])

    return jsonify(goodbye)

@guilds.patch('/guilds/<int:guild_id>/goodbye')
@check_admin
def update_goodbye_setting(guild_id: int, user_id: int):
    settings = database['settings']
    properties = request.form.items()

    for property in properties:
        if property[0] not in ALLOWED_GOODBYE_PROPERTIES:
            continue

        if property[0] == 'channel':
            guild = settings.find_one({ '_id': guild_id })
            channel = guild['goodbye']['channel']
            
            # If previous channel, remove current webhook
            if len(channel) >= 2:
                r = requests.delete(f'{API_ENDPOINT}/webhooks/{channel[1]}/{channel[2]}')

            # If new channel is selected
            if property[1] != 'null':
                # Creating encoded onixo avatar
                dir = os.path.join(os.path.dirname(__file__), '../assets/avatars/onixo.png')
                binary = open(dir, 'rb').read()
                base64_str = base64.b64encode(binary).decode('utf-8')
                data_url = f'data:image/png;base64,{base64_str}'

                # Create new webhook for channel
                headers = {
                    'Authorization': f'Bot {os.getenv("BOT_TOKEN")}',
                    'Content-Type': 'application/json'
                }
                data = {
                    'name': 'Onixo',
                    'avatar': data_url
                }
                r2 = requests.post(f'{API_ENDPOINT}/channels/{property[1]}/webhooks', json=data, headers=headers)
                webhook = r2.json()

                # Update database with new webhook data
                settings.update_one({ '_id': guild_id }, {
                    '$set': {
                        f'goodbye.channel': [int(property[1]), webhook['id'], webhook['token']]
                    }
                })
            
            # Else if new channel is none
            else:
                # Update database with new webhook data
                settings.update_one({ '_id': guild_id }, {
                    '$set': {
                        f'goodbye.channel': []
                    }
                })

        # Else just update the database with the values
        else:
            settings.update_one({ '_id': guild_id }, {
                '$set': {
                    f'goodbye.{property[0]}': property[1]
                }
            })

    return jsonify({})

@guilds.get('/guilds/<int:guild_id>/infractions')
@check_admin
def get_guild_infractions(guild_id: int, user_id: int):
    infractions = send_message(GET_INFRACTIONS, { 'guild_id': guild_id })
    return jsonify(infractions)

@guilds.patch('/guilds/<int:guild_id>/infractions/<int:case_id>')
@check_admin
def update_guild_infraction(guild_id: int, case_id: int, user_id: int):
    infractions = database['infractions']

    for property in request.form.items():
        if property[0] not in ALLOWED_INFRACTION_PROPERTIES:
            continue

        infractions.update_one({ 'case_id': case_id, 'guild_id': guild_id }, {
            '$set': {
                f'{property[0]}': property[1]
            }
        })

    return jsonify({})
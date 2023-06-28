import json
from time import time
from database import database
from utils.websockets import send_message
from utils.constants import GET_CHANNEL, GET_USER

"""
Takes endpoint argunent, and properties argument (is a dict with key value pairs.)
"""
def add_activity(action_id: str, guild_id: int, user_id: int, prev_settings, new_settings):
    db = database['activity']

    # Activity object structure
    activity = {
        'action_id': action_id,
        'guild_id': guild_id,
        'user_id': user_id,
        'timestamp': time(),
        'changes': [],
    }

    # Finding changes
    for k, v in prev_settings.items():
        if k == '_id' or new_settings[k] == '_id':
            continue

        if str(v) != str(new_settings[k]):
            activity['changes'].append({
                'property': k,
                'previous_value': v,
                'new_value': new_settings[k]
            })

    # If no changes were made
    if len(activity['changes']) == 0:
        return

    db.insert_one(activity)

def get_activity(guild_id: int, start_at: int, limit: int):
    db = database['activity']

    activity = db.find({ 'guild_id': guild_id }).limit(limit).skip(start_at).sort('timestamp', -1)

    hydrated_activity = []
    for act in activity:
        del act['_id']
        act['guild_id'] = str(act['guild_id'])

        user = send_message(GET_USER, json.dumps({
            'guild_id': guild_id,
            'user_id': act['user_id'],
        }))
        act['user'] = user

        for change in act['changes']:
            if isinstance(change['previous_value'], list):
                if len(change['previous_value']) >= 2:
                    channel = send_message(GET_CHANNEL, json.dumps({
                        'guild_id': guild_id,
                        'channel_id': change['previous_value'][0]
                    }))
                    change['previous_value'] = channel

            if isinstance(change['new_value'], list):
                if len(change['new_value']) >= 2:
                    channel = send_message(GET_CHANNEL, json.dumps({
                        'guild_id': guild_id,
                        'channel_id': change['new_value'][0]
                    }))
                    change['new_value'] = channel

            if isinstance(change['previous_value'], list):
                change['previous_value'] = None
            if isinstance(change['new_value'], list):
                change['new_value'] = None

            if change['previous_value'] in [0,1]:
                change['previous_value'] = bool(change['previous_value'])
            if change['new_value'] in [0,1]:
                change['new_value'] = bool(change['new_value'])

        hydrated_activity.append(act)

    return hydrated_activity
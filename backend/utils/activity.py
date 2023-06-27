from time import time
from database import database

"""
Takes endpoint argunent, and properties argument (is a dict with key value pairs.)
"""
def add_activity(action_id: str, guild_id: int, prev_settings, new_settings):
    db = database['activity']

    # Activity object structure
    activity = {
        'action_id': action_id,
        'guild_id': guild_id,
        'timestamp': time(),
        'changes': []
    }

    # Finding changes
    for k, v in prev_settings.items():
        if k == '_id' or new_settings[k] == '_id':
            continue

        if str(v) != str(new_settings[k]):
            activity['changes'].append({
                'previous_value': v,
                'new_value': new_settings[k]
            })

    # If no changes were made
    if len(activity['changes']) == 0:
        return

    db.insert_one(activity)
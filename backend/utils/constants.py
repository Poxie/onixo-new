ALLOWED_INFRACTION_PROPERTIES=['reason']
ALLOWED_GOODBYE_PROPERTIES=['message', 'channel']
ALLOWED_WELCOME_PROPERTIES=['message', 'dm', 'channel']
AUTO_ROLE_PROPERTIES=['bots', 'users']
ALLOWED_ANTILINK_SITES=['discord', 'youtube', 'twitter', 'twitch', 'facebook', 'instagram']
ALLOWED_LOGGING_ACTIONS=[f'{action}_{"logs" if action == "all" else "log"}_channel' for action in ['all', 'ban', 'kick', 'mute', 'warn']]
ALLOWED_MOD_SETTINGS_PROPERTIES=['ephemeral', 'confirmation', 'sendDMs', 'incName', 'incReason']
SEND_EMBED='SEND_EMBED'
GET_TOP_ROLE='GET_TOP_ROLE'
GET_INFRACTIONS='GET_INFRACTIONS'
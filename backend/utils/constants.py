ALLOWED_INFRACTION_PROPERTIES=['reason']
ALLOWED_GOODBYE_PROPERTIES=['message', 'channel', 'isEnabled']
ALLOWED_WELCOME_PROPERTIES=['message', 'dm', 'channel', 'isEnabled']
AUTO_ROLE_PROPERTIES=['bots', 'users']
ALLOWED_ANTILINK_SITES=['discord', 'youtube', 'twitter', 'twitch', 'facebook', 'instagram']
ALLOWED_LOGGING_ACTIONS=[f'{action}_{"logs" if action == "all" else "log"}_channel' for action in ['all', 'ban', 'kick', 'mute', 'warn', 'message', 'channel', 'user', 'server', 'voice']]
ALLOWED_MOD_SETTINGS_PROPERTIES=['ephemeral', 'confirmation', 'sendDMs', 'incName', 'incReason']
SEND_EMBED='SEND_EMBED'
GET_TOP_ROLE='GET_TOP_ROLE'
GET_INFRACTIONS='GET_INFRACTIONS'
GET_CHANNEL='GET_CHANNEL'
GET_USER='GET_USER'

SUBSCRIPTION_ACCEPTED='SUBSCRIPTION_ACCEPTED'
SUBSCRIPTION_DENIED='SUBSCRIPTION_DENIED'
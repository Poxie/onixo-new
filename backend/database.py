import os
from time import time
from pymongo import MongoClient

MONGO_USERNAME = os.getenv('MONGO_USERNAME')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_DATABASE = os.getenv('MONGO_DATABASE')
MONGO_AUTH_SOURCE = os.getenv('MONGO_AUTH_SOURCE')
MONGO_AUTH_MECHANISM = os.getenv('MONGO_AUTH_MECHANISM')

client = MongoClient(
    MONGO_HOST,
    username=MONGO_USERNAME,
    password=MONGO_PASSWORD,
    authSource=MONGO_AUTH_SOURCE,
    authMechanism=MONGO_AUTH_MECHANISM
)

database = client[MONGO_DATABASE]

# Checking if is activity supposed to be purged, PURGE_THRESHOLD is in seconds.
PURGE_THRESHOLD = 604800
activity_db = database['activity']

for guild in activity_db.find({}):
    diff = time() - guild['timestamp']
    if diff > PURGE_THRESHOLD:
        activity_db.delete_one({
            'guild_id': guild['guild_id'],
            'timestamp': guild['timestamp']
        })
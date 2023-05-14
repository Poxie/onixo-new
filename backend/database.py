import os
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
import os
from database import database
from flask import Flask
from flask_cors import CORS
from blueprints.auth import auth
from blueprints.guilds import guilds

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

CORS(app, resources={r'/*': {'origins': os.getenv('FRONTEND_ORIGIN')}})

app.register_blueprint(auth)
app.register_blueprint(guilds)

if __name__ == '__init__':
    app.run('127.0.0.1')
import pyrebase
from utils.db.db import config

class DatabaseConnection():

    def __init__(self):
        firebase = pyrebase.initialize_app(config)
        self.db = firebase.database()
        self.auth = firebase.auth()
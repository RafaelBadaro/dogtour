import pyrebase
from utils.db.db import config

class DatabaseConnection():

    def __init__(self):
        pyrebase.pyrebase.quote = self.noquote
        firebase = pyrebase.initialize_app(config)
        self.db = firebase.database()
        self.auth = firebase.auth()


    def noquote(self, s):
        return s
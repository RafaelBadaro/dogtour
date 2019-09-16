import pyrebase
from nameko.rpc import rpc
from utils.db.db import config
from nameko.web.handlers import http

firebase = pyrebase.initialize_app(config)

auth = firebase.auth()
db = firebase.database()

class DogsService:
    name = "dogs"

    @rpc
    def create(self):
        return 0

    
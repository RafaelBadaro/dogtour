import json
import pyrebase
from utils.db.db import config
from nameko.web.handlers import http

firebase = pyrebase.initialize_app(config)

auth = firebase.auth()
db = firebase.database()

class HttpService(object):
    name = "multiply_service"

    @http('GET', '/')
    def get_method(self, request):
        
        email = "dunkel.rotsen@gmail.com"
        password = "12345abc"

        auth.create_user_with_email_and_password(email, password)

        return json.dumps({'BestQuote': "Not all those who wander are lost"})

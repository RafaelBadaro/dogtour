from nameko.rpc import rpc
from nameko.web.handlers import http
from .aux.DatabaseConnection import DatabaseConnection

db = DatabaseConnection().db

class DogsService:
    name = "dogs"

    @rpc
    def create(self, ownerEmail, name, sex, size, temper):

        fOwnerEmail = ownerEmail.replace(".", ",")

        dogData = {
            "name": name,
            "sex": sex,
            "size": size,
            "temper": temper
        }

        ownerData = {}
        ownerData[name] = True

        db.child("dogs").push(dogData)
        db.child("users").child(fOwnerEmail).child("dogs").update(ownerData)
        
        return ""

    
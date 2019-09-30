from nameko.rpc import rpc
from nameko.web.handlers import http
from .auxiliar.DatabaseConnection import DatabaseConnection

db = DatabaseConnection().db

class DogsService:
    name = "dogs"

    @rpc
    def create(self, ownerEmail, name, sex, size, temper):

        fOwnerEmail = ownerEmail.replace(".", ",")

        status = 409
        errorMsg = "Usuario ja possui um cao com este nome!"

        if db.child('users').child(fOwnerEmail).child('dogs').child(name).get().val() is None:

            dogData = {
                "sex": sex,
                "size": size,
                "temper": temper
            }

            db.child("users").child(fOwnerEmail).child("dogs").child(name).set(dogData)
            
            status = 200
            errorMsg = ""

            
        return (status, errorMsg)
from nameko.rpc import rpc
from nameko.web.handlers import http
from .auxiliar.DatabaseConnection import DatabaseConnection

db = DatabaseConnection().db


class DogsService:
    name = "dogs"

    @rpc
    def create(self, ownerEmail, name, sex, size, temper):

        fOwnerEmail = ownerEmail.replace(".", ",")

        if db.child(
                'users'
            ).child(
                fOwnerEmail
        ).child(
                'dogs'
        ).child(
                name
        ).get().val() is None:

            dogData = {
                "name": name,
                "sex": sex,
                "size": size,
                "temper": temper
            }

            ownerData = {}
            ownerData[name] = True

            db.child("dogs").push(dogData)

            db.child(
                "users"
            ).child(
                fOwnerEmail
            ).child(
                "dogs"
            ).update(ownerData)

            return ""

        return "Usuario ja possui um cao com este nome!"

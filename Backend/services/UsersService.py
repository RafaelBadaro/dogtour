from nameko.rpc import rpc
from nameko.web.handlers import http
from .aux.DatabaseConnection import DatabaseConnection

db = DatabaseConnection().db
auth = DatabaseConnection().auth


class UsersService:
    name = "users"

    @rpc
    def create(self, name, email, password, role):

        fEmail = email.replace(".", ",")

        if db.child("users").child(fEmail).get().val() is None:

            user = auth.create_user_with_email_and_password(email, password)
            idToken = user['idToken']

            data = {
                "name": name,
                "role": role
            }

            db.child("users").child(fEmail).set(data, idToken)

            errorMsg = ""
            return (idToken, errorMsg)

        errorMsg = "Usuario ja cadastrado!"
        idToken = ""

        return (idToken, errorMsg)

    @rpc
    def login(self, email, password):

        fEmail = email.replace(".", ",")

        if db.child("users").child(fEmail).get().val() is not None:

            user = auth.sign_in_with_email_and_password(email, password)
            idToken = user['idToken']

            name = db.child("users").child(fEmail).child("name").get().val()

            errorMsg = ""
            return (name, idToken, errorMsg)

        name = ""
        idToken = ""
        errorMsg = "Usuario nao cadastrado!"

        return (name, idToken, errorMsg)

from nameko.rpc import rpc
from nameko.web.handlers import http
from .auxiliar.DatabaseConnection import DatabaseConnection

db = DatabaseConnection().db
auth = DatabaseConnection().auth

class UsersService:
    name = "users"

    @rpc
    def create(self, name, email, password, role):

        fEmail = email.replace(".", ",")

        status = 409
        errorMsg = "Usuario ja cadastrado!"
        idToken = ""

        if db.child("users").child(fEmail).get().val() is None:

            user = auth.create_user_with_email_and_password(email, password)
            idToken = user['idToken']

            data = {
                "name": name,
                "role": role
            }

            db.child("users").child(fEmail).set(data, idToken)

            status = 200
            errorMsg = ""

        return (idToken, status, errorMsg)

    @rpc
    def login(self, email, password):

        fEmail = email.replace(".", ",")
        
        idToken = ""
        status = 409
        errorMsg = "Usuario nao cadastrado!"

        if db.child("users").child(fEmail).get().val() is not None:

            user = auth.sign_in_with_email_and_password(email, password)
            idToken = user['idToken']

            (user, status, errorMsg) = self.get(fEmail)

        return (user, idToken, status, errorMsg)

    @rpc
    def get(self, email):

        fEmail = email.replace(".", ",")

        status = 409
        errorMsg = "Usuario nao cadastrado!"

        user = db.child("users").child(fEmail).get().val()

        if user is not None:
            status = 200
            errorMsg = ""     

        return (user, status, errorMsg)

    @rpc
    def rate(self, email, rating):

        fEmail = email.replace(".", ",")

        status = 409
        errorMsg = "Usuario nao cadastrado!"

        db.child("users").child(fEmail).update({"rating": rating})   

        return (status, errorMsg)

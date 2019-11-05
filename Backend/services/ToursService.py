from nameko.rpc import rpc
from nameko.web.handlers import http
from .auxiliar.DatabaseConnection import DatabaseConnection

db = DatabaseConnection().db

class ToursService:
    name = "tours"

    @rpc
    def create(self, dog, dono, passeador, starting_addres):

        tourData = {
	    "dog" : dog,
	    "dono": dono,
	    "passeador": passeador,
	    "starting_addres": starting_addres
	    }

        db.child('tours').child('198jsdj4feRH').push(tourData)
        status = 200
        errorMsg = ""
        return (status, errorMsg)


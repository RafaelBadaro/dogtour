from nameko.rpc import rpc
from nameko.web.handlers import http
from .auxiliar.DatabaseConnection import DatabaseConnection

db = DatabaseConnection().db
auth = DatabaseConnection().auth

class ToursService:
    name = "tours"

    

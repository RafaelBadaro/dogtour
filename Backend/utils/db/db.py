# Arquivo de configuração do banco de dados Firebase

import pyrebase
import config

config = {
  "apiKey": config.API_KEY,
  "authDomain": "dogtour-app.firebaseapp.com",
  "databaseURL": "https://dogtour-app.firebaseio.com/",
  "projectId": "dogtour-app",
  "storageBucket": "dogtour-app.appspot.com",
  "serviceAccount": config.PATH + "service_key/dogtour-app-key.json",
  "messagingSenderId": "23953050783"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

# Testando a conexção com o banco de dados
db.child().update({"Nome": "Testonildo"})

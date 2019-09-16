import json
from nameko.rpc import RpcProxy
from nameko.web.handlers import http

class APIGateway(object):
    name = 'api_gateway'

    users_rpc = RpcProxy('users')
    dogs_rpc = RpcProxy('dogs')

    
    @http('POST', '/user')
    def create_user(self, request):
        """
        Cria um novo usuário

        Exemplo de request:

        {
            name = "Joao Jorge Fernando"
            email = "jjfernando@email.com"
            password = "124558s"
            role "dono"
        }

        Exemplos de response:

        {
            name = "Joao Jorge Fernando"
            idToken = "i818as1c8ekasdienifneinalsidneifnei"
            error = ""
        }

        {
            name = "Joao Jorge Fernando"
            idToken = ""
            error = "Usuario ja cadastrado!"
        }

        {
            error = "Nao foi possivel criar o seu usuario, tente novamente!"
        }
        """

        (valid, name, email, password, role) = self.requestIsValid(request)

        if not valid:
            return json.dumps({'error': "Nao foi possivel criar o seu usuario, tente novamente!"})
        else:
            (idToken, errorMsg)  = self.users_rpc.create(name, email, password, role)

        return json.dumps({'name': name, 'idToken': idToken, 'error': errorMsg})

    
    @http('POST', '/user/login')
    def login_user(self, request):
        """
        Faz login de um usuário

        Exemplo de request:

        {
            email = "jjfernando@email.com"
            password = "124558s"
        }
        """

        email = request.form['email']
        password = request.form['password']

        (name, idToken, errorMsg)  = self.users_rpc.login(email, password)

        return json.dumps({'name': name, 'idToken': idToken, 'error': errorMsg})

    
    @http('POST', '/user/dogs')
    def create_dog(self, request):
        """
        Cadastro de cães

        Exemplo de request:

        {
            
        }

        Exemplos de response:

        {
            
        }
        """
        
        return 0


    def requestIsValid(self, request):
        valid = False
        
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        role = request.form['role']

        if not (name == "" or email == "" or password == "" or role == ""):
            valid = True

        return (valid, name, email, password, role)

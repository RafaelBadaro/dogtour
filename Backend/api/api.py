import json
from . import validations
from nameko.rpc import RpcProxy
from nameko.web.handlers import http
from werkzeug.wrappers import Response


class APIGateway(object):
    name = 'api_gateway'

    users_rpc = RpcProxy('users')
    dogs_rpc = RpcProxy('dogs')
    tours_rpc = RpcProxy('tours')

    @http('POST', '/api/user')
    def create_user(self, request):

        reqData = json.loads(request.get_data(as_text=True))

        (valid, name, email, password, role) = validations.createUserRequestIsValid(reqData)

        if not valid:
            return Response(
                json.dumps({'name': '', 'idToken': '', 'error': 'Nao foi possivel completar a operacao, tente novamente!'}),
                status=400,
                mimetype='application/json'
            )
        else:
            (idToken, status, errorMsg) = self.users_rpc.create(name, email, password, role)

        return Response(
            json.dumps({'name': name, 'idToken': idToken, 'error': errorMsg}),
            status=status,
            mimetype='application/json'
        )

    @http('POST', '/api/user/login')
    def login_user(self, request):

        reqData = json.loads(request.get_data(as_text=True))

        email = reqData['email']
        password = reqData['password']

        (user, idToken, status, errorMsg) = self.users_rpc.login(email, password)

        return Response(
            json.dumps({'user': user, 'idToken': idToken, 'error': errorMsg}),
            status=status,
            mimetype='application/json'
        )

    @http('POST', '/api/tour')
    def create_tour(self, request):
	
        reqData = json.loads(request.get_data(as_text=True))
        dog = reqData['dog']
        dono = reqData['dono']
        passeador = reqData['passeador']
        starting_addres = reqData['starting_addres']
        
        (status, errorMsg) = self.tours_rpc.create(dog, dono, passeador, starting_addres)

        return Response(
            json.dumps({'error': errorMsg}),
            status=status,
            mimetype='application/json'
        )

    @http('POST', '/api/user/dog')
    def create_dog(self, request):

        reqData = json.loads(request.get_data(as_text=True))

        ownerEmail = reqData['ownerEmail']
        name = reqData['name']
        sex = reqData['sex']
        size = reqData['size']
        temper = reqData['temper']

        (status, errorMsg) = self.dogs_rpc.create(ownerEmail, name, sex, size, temper)

        return Response(
            json.dumps({'error': errorMsg}),
            status=status,
            mimetype='application/json'
        )

    @http('GET', '/api/user/<string:user_email>')
    def get_user(self, request, user_email):

        (user, status, errorMsg) = self.users_rpc.get(user_email)

        return Response(
            json.dumps({'user': user, 'errorMsg': errorMsg}),
            status=status,
            mimetype='application/json'
        )

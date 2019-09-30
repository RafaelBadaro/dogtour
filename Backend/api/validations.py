def createUserRequestIsValid(request):
        valid = False

        name = request['name']
        email = request['email']
        password = request['password']
        role = request['role']

        if not (name == "" or email == "" or password == "" or role == ""):
            valid = True

        return (valid, name, email, password, role)
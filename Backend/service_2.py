from nameko.rpc import rpc

class GreeterService(object):
    name = 'greeter_service'

    @rpc
    def greet(self, name):
        return u'Hello {}!'.format(name)

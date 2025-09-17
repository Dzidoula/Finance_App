import falcon
import uuid
from services.authentication import authenticating_client, get_client


class AuthenticationResource:
    def on_post_auth(self, req, resp):  
        data = req.media
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password or not email:
            raise falcon.HTTPBadRequest(
                title='Missing Required Fields',
                description='You must provide username, password, and email.'
            )

        payload = {
            'id': str(uuid.uuid4()),
            'username': username,
            'password': password,
            'email': email
        }
        authenticating_client(payload)
        resp.media = {
            'status': falcon.HTTP_200,
            'message': 'Authentication successful',
            'error': {},
            'data': f'Thanks for authenticating, {username}!',
            'id': payload['id']
        }
        resp.status = falcon.HTTP_200

    def on_get_client(self,req,resp):
        try:
            client_id = req.get_param('id')
            if not client_id:
                raise falcon.HTTPBadRequest(
                    title='Missing client id',
                    description='You must provide a client id.'
                )
            payload = {
                'id':client_id,
            }
            result = get_client(payload)
            if not result:
                raise falcon.HTTPNotFound(
                    title='Client Not Found',
                    description='No client found with the provided id.'
                )
            resp.status = falcon.HTTP_200
            resp.media = result
        except Exception as e:
            raise falcon.HTTPInternalServerError(
                title='Internal Server Error',
                description=str(e)
            )

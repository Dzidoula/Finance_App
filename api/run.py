import falcon
from falcon_cors import CORS
import json

class CORSMiddleware:
    def process_request(self, req, resp):
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET')
        resp.set_header('Access-Control-Allow-Headers', 'content-type')
        resp.set_header('Access-Control-Expose-Headers', '*')
        resp.set_header('Access-Control-Max-Age', 1728000)  # 20 days
        if req.method == 'OPTIONS':
            raise falcon.HTTPStatus(falcon.HTTP_200, text='\n')

    def process_response(self, req, resp, resource, req_succeeded):
        if 'result' not in resp.context:
            return
        resp.text = json.dumps(resp.context['result'])

# Configurer CORS
cors = CORS(allow_all_origins=['http://localhost:8080'], allow_all_methods=['GET', 'POST', 'PUT', 'DELETE'], allow_all_headers=['Content-Type'])
app = falcon.App(middleware=[CORSMiddleware()])
import routes
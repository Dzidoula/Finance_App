import sys 
from pathlib import Path 

sys.path.append(str(Path(__file__).parent ))

import falcon
from falcon import falcon
import json
import uuid

import os 
from pyres import ResQ
import json
import smtplib

from pyres.worker import Worker
from datetime import datetime


queue_name = "d_queue"

##################################### ENQUEUEJOB ################################################################

resque_client = ResQ(server="localhost:6378", password= "password")


class EnqueueJob():
    queue = queue_name
    @staticmethod
    def perform(job_payload):
        if job_payload["type"] == 'send_mail_job':
            print("send mail ......")
            send_mail_job(job_payload)
        elif job_payload["type"] == 'survey_job':
            print("créer un sondage ........")
        else:
            raise ValueError(f"Unknown job name: {job_name}")




def enqueue_send_mail_job(job_payload):
    """
    Enqueue a job to send an email.
    
    :param job_payload: Dictionary containing job details.
    """
    try:
        resque_client.enqueue(EnqueueJob, job_payload )
        return {'status': 'success', 'message': 'Job enqueued successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


def enqueue_survey_job(job_payload):
    """
    Enqueue a job to process a survey.
    
    :param job_payload: Dictionary containing job details.
    """
    try:
        resque_client.enqueue(EnqueueJob, job_payload)
        return {'status': 'success', 'message': 'Job enqueued successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}



def send_mail_job(job_payload):
    """
    Job to send an email.
    
    :param job_payload: Dictionary containing job details.
    """
    try:
        # Here you would implement the logic to send an email
        message  = "Welcome Welcome"
        print(f"Sending email with payload: {job_payload}")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('mkedaniel04@gmail.com', 'xoqz zmly jxth umvb')
        server.sendmail('mkedaniel04@gmail.com', job_payload["email"], message)
        server.quit()
        # For example, using an email service or SMTP server
        return {'status': 'success', 'message': 'Email sent successfully'}
    
    except Exception as e:
        print(e)
        return None


def creer_sondage(client_id):
    # Stub, à connecter à une vraie logique plus tard
    return {"id": f"sondage_{client_id}", "questions": [...]}



############################################## Endpoints #############################################################

class AuthenticationResource:
    def on_post_auth(self, req, resp):  
        data = req.media
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        create_date = datetime.now().strftime("%H:%M:%S")

        if not username or not password or not email:
            raise falcon.HTTPBadRequest(
                title='Missing Required Fields',
                description='You must provide username, password, and email.'
            )

        payload = {
            'id': str(uuid.uuid4()),
            'username': username,
            'password': password,
            'email': email,
            'create_date' : create_date
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
            data = req.media
            client_id = data.get("id")
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
            
    def on_get_ai_response(self,req,resp,user_prompt):
        
        pass


################################################  SERVICES  ###################################################################
client_info = 'client_info.json' 

def get_client(jobpayload):
    try:
        with open(client_info, 'r') as f:
            clients = json.load(f)

        for client in clients:
            if client['id'] == jobpayload['id']:
                return client
        return None
    except Exception as e:
        print(f"Error {e}")
        return None

def authenticating_client(payload):
    
     # Assuming the file is named clients.json
    try:
        # Send email
        payload_job = {
            'type':'send_mail_job',
            'username':payload["username"],
            'email':payload["email"]
        }

        return_enqueue = enqueue_send_mail_job(payload_job)
        print(return_enqueue)
        # Lire le fichier existant
        with open(client_info, 'r') as f:
            clients = json.load(f)
        
        clients.append(payload)

        #Réécrire le fichier avec la nouvelle donnée
        with open(client_info, 'w') as f:
            json.dump(clients, f, indent=4)
    except Exception as e :
        return f"Error {e}"





app = falcon.App()
resource = AuthenticationResource()

# Registering the AuthenticationResource with the Falcon app
app.add_route('/authenticate', resource,suffix="auth")
app.add_route('/client', resource,suffix="client")

#worker = Worker([queue_name],resque_client)
#worker.work() # Start listening for and processing jobs



    


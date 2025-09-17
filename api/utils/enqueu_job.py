import os 
from pyres import ResQ
import json
import smtplib

resque_client = ResQ(host=os.getenv('REDIS_HOST', 'localhost'), port=int(os.getenv('REDIS_PORT', 6379)))

class EnqueueJob():

    @staticmethod
    def perform(job_name, job_payload):
        if job_name == 'send_mail_job':
            print("send mail ......")
        elif job_name == 'survey_job':
            print("créer un sondage ........")
        else:
            raise ValueError(f"Unknown job name: {job_name}")




def enqueue_send_mail_job(job_payload):
    """
    Enqueue a job to send an email.
    
    :param job_payload: Dictionary containing job details.
    """
    try:
        resque_client.enqueue(EnqueueJob, 'send_mail_job', job_payload )
        return {'status': 'success', 'message': 'Job enqueued successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


def enqueue_survey_job(job_payload):
    """
    Enqueue a job to process a survey.
    
    :param job_payload: Dictionary containing job details.
    """
    try:
        resque_client.enqueue(EnqueueJob,'survey_job', job_payload)
        return {'status': 'success', 'message': 'Job enqueued successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}



def send_mail_job(job_payload):
    """
    Job to send an email.
    
    :param job_payload: Dictionary containing job details.
    """
    # Here you would implement the logic to send an email
    print(f"Sending email with payload: {job_payload}")
    server = smtplib.SMTP('smtp.example.com', 587)
    server.starttls()
    server.login('user', 'pass')
    server.sendmail('mkedaniel04@gmail.com', destinataire, message)
    server.quit()
    # For example, using an email service or SMTP server
    return {'status': 'success', 'message': 'Email sent successfully'}


def creer_sondage(client_id):
    # Stub, à connecter à une vraie logique plus tard
    return {"id": f"sondage_{client_id}", "questions": [...]}

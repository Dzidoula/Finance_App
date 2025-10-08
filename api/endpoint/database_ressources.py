import falcon
import json

from services.historiques import get_historiques, add_historiques,delete_historique
from services.stats import stats, stats_sous_categorie_montant

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
redirect_uris = "http://localhost:8000/oauth2callback"

class DatabaseCall():
    def on_get_oauth2callback(self,req,resp):
        """Shows basic usage of the Gmail API.
        Lists the user's Gmail labels.
        """
        creds = None
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists("token.json"):
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    "client_secret_811985083762-e39krjdh5f2a3u5pimtoq9aemi1f5ed0.apps.googleusercontent.com.json", SCOPES
                )
                #creds = flow.run_local_server(port=8000)
                creds = flow.redirect_uri = redirect_uris
            # Save the credentials for the next run
            with open("token.json", "w") as token:
                token.write(creds.to_json())

        try:
            # Call the Gmail API
            service = build("gmail", "v1", credentials=creds)
            results = service.users().labels().list(userId="me").execute()
            labels = results.get("labels", [])

            if not labels:
                print("No labels found.")
                return
            print("Labels:")
            for label in labels:
                print(label["name"])

        except HttpError as error:
            # TODO(developer) - Handle errors from gmail API.
            print(f"An error occurred: {error}")
    
    
    def on_get_historiques(self,req,resp):
        try:
            data = req.params
            #if not data:
            #    resp.status = falcon.HTTP_400
            #    resp.text = json.dumps(
            #        [{
            #            "error":"missing parameters"
            #        }]
            #    )
                
            payload = {
                "type": data.get("type") if data.get("type") in ['revenu', 'depense'] else None,
                "status": int(data.get("status") )if data.get("status") else 1 ,
                # range in: day|week|month|year|custom
                "range": data.get("range"),
                # custom dates expected as ISO: YYYY-MM-DDTHH:MM:SS
                "start_date": data.get("start_date"),
                "end_date": data.get("end_date")
            }
            result = get_historiques(payload)
            resp.status = falcon.HTTP_200
            resp.text = json.dumps({
                "result":result
            })
        except Exception as e:
            resp.status = falcon.HTTP_500
            resp.text = f"Internal Server : {e}"
            return 
    
    def on_post_add_historique(self,req,resp):
        try:
            data = req.media
            print(f"data .......... {data}")
            
            # Input validation
            required_fields = ['type', 'sous_categorie', 'montant']
            for field in required_fields:
                if field not in data or not data[field]:
                    resp.status = falcon.HTTP_400
                    resp.text = json.dumps({"error": f"Missing required field: {field}"})
                    return
            
            if data['type'] not in ['revenu', 'depense']:
                resp.status = falcon.HTTP_400
                resp.text = json.dumps({"error": "Type must be 'revenu' or 'depense'"})
                return
                
            try:
                montant = float(data['montant'])
                if montant <= 0:
                    resp.status = falcon.HTTP_400
                    resp.text = json.dumps({"error": "Amount must be positive"})
                    return
            except ValueError:
                resp.status = falcon.HTTP_400
                resp.text = json.dumps({"error": "Amount must be a valid number"})
                return
            
            add_historiques(data)
            resp.status = falcon.HTTP_200
            resp.text = json.dumps({"message":"Succes"})
        except Exception as e:
            resp.status = falcon.HTTP_500
            resp.text = json.dumps({"error": f"Internal Server Error: {str(e)}"})
            return 
        
    def on_put_delete_historique(self,req,resp):
        
        try:
            data = req.media
            print(f"data .......... {data}")
            delete_historique(data)
            resp.status = falcon.HTTP_200
            resp.text = json.dumps({"message":"Succes"})
        except Exception as e:
            resp.status = falcon.HTTP_500
            resp.text = f"Internal Server : {e}"
            return 
        
    def on_get_stats(self,req,resp):
        try:
            data = req.params
            payload = {
                # range in: day|week|month|year|custom
                "range": data.get("range"),
                # custom dates expected as ISO: YYYY-MM-DDTHH:MM:SS
                "start_date": data.get("start_date"),
                "end_date": data.get("end_date")
            }
            result = stats(payload)
            if result:
                resp.status = falcon.HTTP_200
                resp.text = json.dumps({
                    "result":result
                })
            else:
                raise "ERROR"
        except Exception as e:
            resp.status = falcon.HTTP_500
            resp.text = f"Internal Server : {e}"
            return 
        
    def on_get_stats_sous_categorie(self,req,resp):
        try:
            data = req.params
            payload = {
                # range in: day|week|month|year|custom
                "range": data.get("range"),
                # custom dates expected as ISO: YYYY-MM-DDTHH:MM:SS
                "start_date": data.get("start_date"),
                "end_date": data.get("end_date")
            }
            result = stats_sous_categorie_montant(payload)
            if result:
                resp.status = falcon.HTTP_200
                resp.text = json.dumps({
                    "result":result
                })
            else:
                raise "ERROR"
        except Exception as e:
            resp.status = falcon.HTTP_500
            resp.text = f"Internal Server : {e}"
            return 
        
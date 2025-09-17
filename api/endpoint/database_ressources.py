import falcon
import json

from services.historiques import get_historiques, add_historiques,delete_historique
from services.stats import stats


class DatabaseCall():
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
            result = stats()
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
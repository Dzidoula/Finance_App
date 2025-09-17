import falcon
from utils.db_client import get_db
#from utils.db_caller import add_in_collection

def pipeline_stats(type):
    
    pipeline = [
        {
            "$match":{"type":type}
        },
        {
            "$project":{
                "montant":{
                    "$toLong":"$montant",
                }
                }
        },
        {
            "$group":{
                "_id":None,
                "montant_total":{"$sum":"$montant"}
            }
        },
        {
            "$project":{
                "_id":0,
                "montant_total":1
            }
        }
    ]
    return pipeline

def stats() :
    db = get_db()
    collection = "historiques"
    data : dict = {}
    for type in ['revenu','depense']:
        pipeline = pipeline_stats(type)
        result = list(db[collection].aggregate(pipeline))
        #print(f"result ............ ***** {result}")
        if result and len(result) > 0:
            data[type] = result[0]["montant_total"]
        else:
            data[type] = 0
    data["actif"] = data["revenu"] - data["depense"] 
    return data

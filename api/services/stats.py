import falcon
from utils.db_client import get_db
from services.historiques import _compute_date_range
import math
#from utils.db_caller import add_in_collection

def pipeline_stats(type , start_dt, end_dt, sous_categorie=""):
    
    # Build pipeline
    pipeline = []
    # Add parsed date field once
    pipeline.append({
        "$addFields": {
            "parsedTimestamp": {
                "$dateFromString": {
                    "dateString": "$created_date",
                    "format": "%Y-%m-%dT%H:%M:%S"
                }
            }
        }
    })

    # type match
    match_stage = {
        "$match":{
            "type":type
        }
    }
    # sous_categorie match if provided
    if sous_categorie:
        match_stage["$match"]["sous_categorie"] = sous_categorie
    # Date range match if provided 
    if (start_dt and end_dt):
        match_stage["$match"]["parsedTimestamp"]= {
                    "$gte": start_dt,
                    "$lte": end_dt
        }
    
    pipeline.append(match_stage)    
       
        
    
    partial_pipeline = [
        #{
        #    "$project":{
        #        "montant":{
        #            "$toLong":"$montant",
        #        }
        #        }
        #},
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
    for stage in partial_pipeline:
        pipeline.append(stage)
        
        
    return pipeline

def stats(payload) :
    db = get_db()
    collection = "historiques"
     # Compute optional date range
    range_key = payload.get("range")  # day|week|month|year|custom
    start_str = payload.get("start_date")
    end_str = payload.get("end_date")
    start_dt, end_dt = _compute_date_range(range_key, start_str, end_str) if range_key else (None, None)

    data : dict = {}
    for type in ['revenu','depense']:
        pipeline = pipeline_stats(type, start_dt, end_dt)
        result = list(db[collection].aggregate(pipeline))
        #print(f"result ............ ***** {result}")
        if result and len(result) > 0:
            data[type] = result[0]["montant_total"]
        else:
            data[type] = 0
    data["actif"] = data["revenu"] - data["depense"] 
    return data


def stats_sous_categorie_montant(payload):
    db = get_db()
    collection = "historiques"
   
     # Compute optional date range
    range_key = payload.get("range")  # day|week|month|year|custom
    start_str = payload.get("start_date")
    end_str = payload.get("end_date")
    start_dt, end_dt = _compute_date_range(range_key, start_str, end_str) if range_key else (None, None)

    #Sous_categorie
    collection_sous_categorie = "sous_category"
    pipeline_sous_category = [
        {
            "$project":{
                "_id":0,
                "type":0
            }
        }
    ]
    data_sous_category = list(db[collection_sous_categorie].aggregate(pipeline_sous_category))
    data : dict = {"revenu":{},"depense":{}}
    for type in ['revenu','depense']:
        for sous_ct in data_sous_category[0][type]:
            pipeline = pipeline_stats(type, start_dt, end_dt,sous_ct)
            result = list(db[collection].aggregate(pipeline))
            #data[type][sous_ct] = result[0]['montant_total']
            for elt in result:
                data[type][sous_ct] = elt.get('montant_total', 0)
            
    for type in ['revenu','depense']:
           total = sum(data[type].values())
           # print(f"r {type} : {total}")
           pData = data[type]
           data[type] = {f"{key}":value*100/total for key,value in pData.items()}
    
    return data

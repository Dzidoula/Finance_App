import falcon
from pymongo  import MongoClient
import datetime


def add_in_collection(db,payload): 
    if "historiques" not in db.list_collection_names():
        db.create_collection("historiques")
        
    db["historiques"].insert_one(payload)
    pass

def edit_sous_categories(db,payload):
    if "sous_category" not in db.list_collection_names():
        db.create_collection("sous_category") 
    query={}
    
    pipeline = [
            {
                "$project":{
                "_id":0,
                f"{payload['type']}":1
                }
            },
            {
                "$project":{
                "verification":{
                    "$filter":{
                    "input":f"${payload['type']}",
                    "as":"input",
                    "cond":{
                        "$eq":["$$input",f"{payload['sous_categorie'].lower()}"]
                    }
                    }
                }
                }
            },
            {
                "$project":{
                "verification":{
                    "$cond":{
                    "if":"$verification",
                    "then": True,
                    "else": False
                    }
                }
                }
            }
        ]
    result = list(db["sous_category"].aggregate(pipeline))
    print("result ................ ", result)
    if not result[0]["verification"]:
        db["sous_category"].update_one(query,{"$push":{payload['type']:payload['sous_categorie'].lower()}})
    
    pass

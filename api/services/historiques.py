import falcon
from pymongo  import MongoClient
import datetime
from utils.db_client import get_db
from utils.db_caller import add_in_collection,edit_sous_categories
from uuid import uuid4
collection = "historiques"
def add_historiques(jobpayload):
    db = get_db()
    jobpayload["id"] = str(uuid4())
    jobpayload["sous_categorie"] = jobpayload["sous_categorie"].lower()
    jobpayload["created_date"] = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    add_in_collection(db,jobpayload)
    payload_sous_categorie ={
        "type":jobpayload["type"],
        "sous_categorie":jobpayload["sous_categorie"]
    } 
    edit_sous_categories(db,payload_sous_categorie)
    pass


def format_historiques_dates(historiques):
    for h in historiques:
        try:
            dt = datetime.datetime.strptime(h["created_date"], "%Y-%m-%dT%H:%M:%S")
            h["created_date"] = dt.strftime("%d/%m/%Y %H:%M:%S")
        except Exception:
            pass  # Ignore if already formatted or invalid
    
    print("histori ......", historiques)
    return historiques

def _compute_date_range(range_key: str, start_str: str = None, end_str: str = None):
    now = datetime.datetime.now()
    # Normalize to start of day for ranges
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    if range_key == 'day':
        start = today_start
        end = today_start + datetime.timedelta(days=1) - datetime.timedelta(seconds=1)
    elif range_key == 'week':
        # ISO week: Monday=0
        start = today_start - datetime.timedelta(days=today_start.weekday())
        end = start + datetime.timedelta(days=7) - datetime.timedelta(seconds=1)
    elif range_key == 'month':
        start = today_start.replace(day=1)
        if start.month == 12:
            next_month = start.replace(year=start.year+1, month=1)
        else:
            next_month = start.replace(month=start.month+1)
        end = next_month - datetime.timedelta(seconds=1)
    elif range_key == 'year':
        start = today_start.replace(month=1, day=1)
        end = start.replace(year=start.year+1) - datetime.timedelta(seconds=1)
    elif range_key == 'custom' and start_str and end_str:
        # Expecting ISO like 2025-09-17T00:00:00
        start = datetime.datetime.strptime(start_str, "%Y-%m-%dT%H:%M:%S")
        end = datetime.datetime.strptime(end_str, "%Y-%m-%dT%H:%M:%S")
    else:
        return None, None
    return start, end


def get_historiques(payload):
    db = get_db()

    # Base filters
    status_match = {"$match": {"status": payload.get("status")}}
    type_filter = payload.get("type")
    if type_filter:
        status_match["$match"]["type"] = type_filter

    # Compute optional date range
    range_key = payload.get("range")  # day|week|month|year|custom
    start_str = payload.get("start_date")
    end_str = payload.get("end_date")
    start_dt, end_dt = _compute_date_range(range_key, start_str, end_str) if range_key else (None, None)

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

    # Status/type match
    pipeline.append(status_match)

    # Date range match if provided
    if (start_dt and end_dt):
        pipeline.append({
            "$match": {
                "parsedTimestamp": {
                    "$gte": start_dt,
                    "$lte": end_dt
                }
            }
        })
        

    # Sort and project
    pipeline.append({"$sort": {"parsedTimestamp": -1}})
    pipeline.append({"$project": {"_id": 0, "parsedTimestamp": 0}})

    print(pipeline)
    result = list(db[collection].aggregate(pipeline))
    return format_historiques_dates(result)

def delete_historique(jobpayload):
    db = get_db()
    query = {"status":1}
    if jobpayload.get("id"):
        query["id"] = jobpayload.get("id")
    print(query)
    result = db[collection].update_one(query,{"$set":{"status":0}})
    print(result.matched_count)
    #return True
    
def get_sous_categories(jobpayload={}):
    db = get_db()
    pipeline = [
        {
            "$project":{
                "_id":0
            }
        }
    ]
    transaction_type = jobpayload.get('type')
    if transaction_type:
        pipeline["$project"][f"{transaction_type}"] = 1
    result  = db[collection].aggregate(pipeline)
    
    return list(result)


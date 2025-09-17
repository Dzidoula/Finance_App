import falcon
from pymongo  import MongoClient
import datetime


def get_db():
    connect_path = "mongodb://username:password@127.0.0.1:27117,127.0.0.1:27118"
    client = MongoClient(connect_path)
    db_name = "dane_connection"
    db = client[db_name] 
    return db
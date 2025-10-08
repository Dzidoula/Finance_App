from pymongo import MongoClient, ASCENDING, DESCENDING
from datetime import datetime

def init_database():
    """
    Initialize database with proper indexes and collections
    """
    try:
        # Connect to MongoDB using the same configuration as db_client.py
        connect_path = "mongodb://username:password@127.0.0.1:27117,127.0.0.1:27118"
        client = MongoClient(connect_path)
        db_name = "dane_connection"
        db = client[db_name]
        
        # Create collections if they don't exist
        collections = ['historiques', 'sous_category', 'users']
        for collection_name in collections:
            if collection_name not in db.list_collection_names():
                db.create_collection(collection_name)
                print(f"Created collection: {collection_name}")
        
        # Create indexes for better performance
        historiques = db['historiques']
        
        # Index on type for faster filtering
        historiques.create_index([("type", ASCENDING)])
        
        # Index on created_date for faster sorting
        historiques.create_index([("created_date", DESCENDING)])
        
        # Index on status for faster queries
        historiques.create_index([("status", ASCENDING)])
        
        # Compound index for common queries
        historiques.create_index([("type", ASCENDING), ("status", ASCENDING)])
        historiques.create_index([("created_date", DESCENDING), ("status", ASCENDING)])
        
        # Index on id for faster lookups
        historiques.create_index([("id", ASCENDING)])
        
        print("Database initialized successfully with indexes")
        
        # Create some sample data if collections are empty
        if historiques.count_documents({}) == 0:
            sample_data = [
                {
                    "id": "sample-1",
                    "type": "revenu",
                    "sous_categorie": "salaire",
                    "montant": 500000,
                    "status": 1,
                    "created_date": "2024-01-15T09:00:00"
                },
                {
                    "id": "sample-2", 
                    "type": "depense",
                    "sous_categorie": "nourriture",
                    "montant": 25000,
                    "status": 1,
                    "created_date": "2024-01-16T12:30:00"
                },
                {
                    "id": "sample-3",
                    "type": "depense", 
                    "sous_categorie": "transport",
                    "montant": 15000,
                    "status": 1,
                    "created_date": "2024-01-17T08:15:00"
                }
            ]
            historiques.insert_many(sample_data)
            print("Sample data inserted")
        
        return True
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        return False

if __name__ == "__main__":
    init_database()

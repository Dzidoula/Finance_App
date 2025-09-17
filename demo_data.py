#!/usr/bin/env python3
"""
Script pour ajouter des données de démonstration réalistes
"""
import random
from datetime import datetime, timedelta
from api.utils.db_client import get_db

def add_demo_data():
    """Ajouter des données de démonstration réalistes"""
    
    # Catégories de revenus
    revenu_categories = [
        "Salaire", "Freelance", "Investissement", "Vente", "Prime", 
        "Remboursement", "Location", "Dividendes", "Bonus", "Autre"
    ]
    
    # Catégories de dépenses
    depense_categories = [
        "Nourriture", "Transport", "Logement", "Santé", "Loisirs",
        "Éducation", "Vêtements", "Électricité", "Internet", "Assurance",
        "Restaurant", "Courses", "Carburant", "Abonnement", "Réparation"
    ]
    
    # Montants réalistes pour les revenus (en FCFA)
    revenu_amounts = [150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000]
    
    # Montants réalistes pour les dépenses (en FCFA)
    depense_amounts = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000]
    
    try:
        db = get_db()
        collection = db['historiques']
        
        # Vider la collection existante
        collection.delete_many({})
        print("🗑️  Anciennes données supprimées")
        
        # Générer des données pour les 3 derniers mois
        start_date = datetime.now() - timedelta(days=90)
        transactions = []
        
        # Ajouter des revenus (2-3 par mois)
        for month in range(3):
            for _ in range(random.randint(2, 3)):
                transaction = {
                    "id": f"revenu_{len(transactions)+1}",
                    "type": "revenu",
                    "sous_categorie": random.choice(revenu_categories).lower(),
                    "montant": random.choice(revenu_amounts),
                    "status": 1,
                    "created_date": (start_date + timedelta(days=month*30 + random.randint(1, 28))).strftime("%Y-%m-%dT%H:%M:%S")
                }
                transactions.append(transaction)
        
        # Ajouter des dépenses (8-12 par mois)
        for month in range(3):
            for _ in range(random.randint(8, 12)):
                transaction = {
                    "id": f"depense_{len(transactions)+1}",
                    "type": "depense",
                    "sous_categorie": random.choice(depense_categories).lower(),
                    "montant": random.choice(depense_amounts),
                    "status": 1,
                    "created_date": (start_date + timedelta(days=month*30 + random.randint(1, 28))).strftime("%Y-%m-%dT%H:%M:%S")
                }
                transactions.append(transaction)
        
        # Insérer toutes les transactions
        collection.insert_many(transactions)
        
        print(f"✅ {len(transactions)} transactions de démonstration ajoutées")
        print("📊 Données générées pour les 3 derniers mois")
        
        # Afficher un résumé
        revenus = collection.count_documents({"type": "revenu", "status": 1})
        depenses = collection.count_documents({"type": "depense", "status": 1})
        
        print(f"💰 Revenus: {revenus} transactions")
        print(f"💸 Dépenses: {depenses} transactions")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    print("🎭 Génération de données de démonstration...")
    add_demo_data()

#!/usr/bin/env python3
"""
Script de test pour vérifier que l'application fonctionne correctement
"""
import requests
import json
import time

def test_backend():
    """Tester les endpoints du backend"""
    base_url = "http://localhost:8000"
    
    print("🧪 Test des endpoints backend...")
    
    try:
        # Test de l'endpoint stats
        print("  📊 Test de l'endpoint /stats...")
        response = requests.get(f"{base_url}/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"    ✅ Stats: {data}")
        else:
            print(f"    ❌ Erreur stats: {response.status_code}")
            return False
        
        # Test de l'endpoint historiques
        print("  📋 Test de l'endpoint /historiques...")
        response = requests.get(f"{base_url}/historiques", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"    ✅ Historiques: {len(data.get('result', []))} transactions")
        else:
            print(f"    ❌ Erreur historiques: {response.status_code}")
            return False
        
        # Test d'ajout d'une transaction
        print("  ➕ Test d'ajout d'une transaction...")
        test_transaction = {
            "type": "revenu",
            "sous_categorie": "test",
            "montant": 1000
        }
        response = requests.post(f"{base_url}/add_historique", 
                               json=test_transaction, 
                               timeout=5)
        if response.status_code == 200:
            print("    ✅ Transaction ajoutée avec succès")
        else:
            print(f"    ❌ Erreur ajout: {response.status_code}")
            return False
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("    ❌ Impossible de se connecter au backend")
        print("    💡 Assurez-vous que le backend est démarré")
        return False
    except Exception as e:
        print(f"    ❌ Erreur: {e}")
        return False

def test_frontend():
    """Tester l'accès au frontend"""
    print("🌐 Test du frontend...")
    
    try:
        response = requests.get("http://localhost:8080", timeout=5)
        if response.status_code == 200:
            print("    ✅ Frontend accessible")
            return True
        else:
            print(f"    ❌ Erreur frontend: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("    ❌ Impossible d'accéder au frontend")
        print("    💡 Assurez-vous que le frontend est démarré")
        return False
    except Exception as e:
        print(f"    ❌ Erreur: {e}")
        return False

def main():
    """Fonction principale de test"""
    print("=" * 50)
    print("🧪 TEST DE L'APPLICATION")
    print("=" * 50)
    
    # Attendre un peu que les serveurs démarrent
    print("⏳ Attente du démarrage des serveurs...")
    time.sleep(3)
    
    # Tester le backend
    backend_ok = test_backend()
    
    # Tester le frontend
    frontend_ok = test_frontend()
    
    print("\n" + "=" * 50)
    if backend_ok and frontend_ok:
        print("🎉 TOUS LES TESTS SONT PASSÉS!")
        print("✅ L'application fonctionne correctement")
        print("🌐 Ouvrez http://localhost:8080 dans votre navigateur")
    else:
        print("❌ CERTAINS TESTS ONT ÉCHOUÉ")
        if not backend_ok:
            print("🔧 Vérifiez que le backend est démarré")
        if not frontend_ok:
            print("🌐 Vérifiez que le frontend est démarré")
    print("=" * 50)

if __name__ == "__main__":
    main()



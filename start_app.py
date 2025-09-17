#!/usr/bin/env python3
"""
Script de démarrage pour l'application de gestion financière
"""
import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_requirements():
    """Vérifier que les dépendances sont installées"""
    try:
        import falcon
        import pymongo
        print("✅ Dépendances Python OK")
        return True
    except ImportError as e:
        print(f"❌ Dépendance manquante: {e}")
        print("Installez les dépendances avec: pip install -r requirements.txt")
        return False

def init_database():
    """Initialiser la base de données"""
    try:
        print("🗄️  Initialisation de la base de données...")
        from api.utils.db_init import init_database
        if init_database():
            print("✅ Base de données initialisée avec succès")
            return True
        else:
            print("❌ Erreur lors de l'initialisation de la base de données")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        print("Assurez-vous que MongoDB est démarré")
        return False

def start_backend():
    """Démarrer le serveur backend"""
    try:
        print("🚀 Démarrage du serveur backend...")
        os.chdir("api")
        subprocess.Popen([sys.executable, "run.py"], 
                        stdout=subprocess.PIPE, 
                        stderr=subprocess.PIPE)
        print("✅ Backend démarré sur http://localhost:8002")
        return True
    except Exception as e:
        print(f"❌ Erreur lors du démarrage du backend: {e}")
        return False

def start_frontend():
    """Démarrer le serveur frontend"""
    try:
        print("🌐 Démarrage du serveur frontend...")
        os.chdir("../frontend")
        subprocess.Popen([sys.executable, "-m", "http.server", "8080"],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE)
        print("✅ Frontend démarré sur http://localhost:8080")
        return True
    except Exception as e:
        print(f"❌ Erreur lors du démarrage du frontend: {e}")
        return False

def main():
    """Fonction principale"""
    print("=" * 50)
    print("🏦 GESTIONNAIRE FINANCIER PERSONNEL")
    print("=" * 50)
    
    # Vérifier les dépendances
    if not check_requirements():
        return
    
    # Initialiser la base de données
    if not init_database():
        return
    
    # Démarrer le backend
    if not start_backend():
        return
    
    # Attendre un peu que le backend démarre
    time.sleep(2)
    
    # Démarrer le frontend
    if not start_frontend():
        return
    
    print("\n" + "=" * 50)
    print("🎉 APPLICATION DÉMARRÉE AVEC SUCCÈS!")
    print("=" * 50)
    print("📊 Frontend: http://localhost:8080")
    print("🔧 Backend API: http://localhost:8002")
    print("\n💡 Ouvrez votre navigateur et allez sur http://localhost:8080")
    print("⏹️  Appuyez sur Ctrl+C pour arrêter l'application")
    print("=" * 50)
    
    # Ouvrir automatiquement le navigateur
    try:
        webbrowser.open("http://localhost:8080")
    except:
        pass
    
    # Attendre que l'utilisateur arrête l'application
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Arrêt de l'application...")
        print("✅ Application arrêtée")

if __name__ == "__main__":
    main()

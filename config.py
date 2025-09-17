"""
Configuration de l'application de gestion financière
"""
import os

# Configuration de la base de données
DATABASE_CONFIG = {
    'host': '127.0.0.1',
    'port': 27117,
    'username': 'username',
    'password': 'password',
    'database': 'dane_connection',
    'connection_string': 'mongodb://username:password@127.0.0.1:27117,127.0.0.1:27118'
}

# Configuration du serveur
SERVER_CONFIG = {
    'host': 'localhost',
    'port': 8002,
    'debug': True
}

# Configuration du frontend
FRONTEND_CONFIG = {
    'host': 'localhost',
    'port': 8080,
    'url': 'http://localhost:8080'
}

# Configuration des collections MongoDB
COLLECTIONS = {
    'historiques': 'historiques',
    'sous_categories': 'sous_category',
    'users': 'users'
}

# Configuration des types de transactions
TRANSACTION_TYPES = {
    'REVENU': 'revenu',
    'DEPENSE': 'depense'
}

# Configuration des couleurs pour l'interface
UI_COLORS = {
    'revenu': '#4CAF50',
    'depense': '#f44336',
    'actif': '#2196F3',
    'primary': '#667eea',
    'secondary': '#764ba2'
}

# Messages d'erreur
ERROR_MESSAGES = {
    'missing_fields': 'Champs requis manquants',
    'invalid_type': 'Type de transaction invalide',
    'invalid_amount': 'Montant invalide',
    'database_error': 'Erreur de base de données',
    'server_error': 'Erreur du serveur'
}

# Messages de succès
SUCCESS_MESSAGES = {
    'transaction_added': 'Transaction ajoutée avec succès',
    'transaction_deleted': 'Transaction supprimée avec succès',
    'database_initialized': 'Base de données initialisée avec succès'
}

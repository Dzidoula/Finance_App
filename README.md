# Gestionnaire Financier Personnel

Une application web moderne pour la gestion de vos finances personnelles, construite avec Python Falcon (backend) et JavaScript (frontend).

## 🚀 Fonctionnalités

- **Gestion des transactions** : Ajouter, visualiser et supprimer des revenus et dépenses
- **Dashboard interactif** : Vue d'ensemble de vos finances avec des cartes colorées
- **Graphiques** : Visualisation des données financières avec Chart.js
- **Filtrage** : Filtrer les transactions par type (revenus/dépenses)
- **Interface moderne** : Design responsive et intuitif
- **Validation des données** : Validation côté client et serveur

## 🛠️ Technologies Utilisées

### Backend
- **Python Falcon** : Framework web léger et rapide
- **MongoDB** : Base de données NoSQL
- **PyMongo** : Driver MongoDB pour Python
- **Gunicorn** : Serveur WSGI

### Frontend
- **JavaScript ES6+** : Langage de programmation
- **Chart.js** : Bibliothèque de graphiques
- **Font Awesome** : Icônes
- **CSS3** : Styles modernes avec gradients et animations

## 📦 Installation

### Prérequis
- Python 3.7+
- MongoDB
- Node.js (pour les dépendances frontend)

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd MyProject
```

### 2. Installer les dépendances Python
```bash
pip install -r requirements.txt
```

### 3. Installer les dépendances frontend
```bash
cd frontend
npm install
```

### 4. Initialiser la base de données
```bash
cd api
python utils/db_init.py
```

## 🚀 Lancement de l'application

### 1. Démarrer MongoDB
```bash
mongod
```

### 2. Démarrer le serveur backend
```bash
cd api
gunicorn run:app -b 0.0.0.0:8000
```
Le serveur sera accessible sur `http://localhost:8000`

### 3. Servir le frontend
```bash
cd frontend
# Utilisez un serveur HTTP simple
#python -m http.server 8080
# ou
#npx serve .
#ou
npm start
```
Le frontend sera accessible sur `http://localhost:8080`

## 📊 Structure du projet

```
MyProject/
├── api/                    # Backend Python
│   ├── endpoint/          # Points d'API
│   ├── services/          # Logique métier
│   ├── utils/             # Utilitaires
│   └── run.py            # Point d'entrée
├── frontend/              # Frontend JavaScript
│   ├── css/              # Styles
│   ├── js/               # Scripts JavaScript
│   └── index.html        # Page principale
└── requirements.txt       # Dépendances Python
```

## 🔧 API Endpoints

- `GET /historiques` - Récupérer les transactions
- `POST /add_historique` - Ajouter une transaction
- `PUT /delete_historique` - Supprimer une transaction
- `GET /stats` - Récupérer les statistiques financières

## 💡 Utilisation

1. **Dashboard** : Consultez vos revenus, dépenses et actif net
2. **Historiques** : Gérez vos transactions avec filtrage par type
3. **Ajout** : Cliquez sur "Add" pour ajouter une nouvelle transaction
4. **Suppression** : Cliquez sur l'icône poubelle pour supprimer une transaction

## 🎨 Personnalisation

### Couleurs des cartes
Modifiez les gradients dans `frontend/css/styles.css` :
- Revenus : Vert (#4CAF50)
- Dépenses : Rouge (#f44336)  
- Actif : Bleu (#2196F3)

### Ajout de nouvelles catégories
Les sous-catégories sont automatiquement ajoutées à la base de données lors de la première utilisation.

## 🔒 Sécurité

- Validation des données côté client et serveur
- Protection contre les injections
- Gestion des erreurs appropriée

## 📈 Améliorations futures

- [ ] Authentification utilisateur
- [ ] Export des données (PDF, Excel)
- [ ] Graphiques avancés
- [ ] Notifications
- [ ] Sauvegarde automatique
- [ ] Mode sombre

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📄 Licence

Ce projet est sous licence MIT.


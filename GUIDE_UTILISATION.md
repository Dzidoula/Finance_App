# 🏦 Guide d'utilisation - Gestionnaire Financier

## 🚀 Démarrage rapide

### 1. Installation et configuration
```bash
# Cloner le projet
cd MyProject

# Installer les dépendances
./deploy.sh

# Initialiser la base de données
cd api && python3 utils/db_init.py

# Ajouter des données de démonstration (optionnel)
python3 demo_data.py
```

### 2. Lancement de l'application
```bash
# Méthode simple (recommandée)
python3 start_app.py

# Ou manuellement :
# Terminal 1 - Backend
cd api && python3 run.py

# Terminal 2 - Frontend  
cd frontend && python3 -m http.server 8080
```

### 3. Accès à l'application
- **Interface utilisateur** : http://localhost:8080
- **API Backend** : http://localhost:8002

## 📱 Utilisation de l'interface

### Dashboard
- **Cartes colorées** : Affichent vos revenus, dépenses et actif net
- **Graphique circulaire** : Visualisation des proportions revenus/dépenses
- **Mise à jour en temps réel** : Les données se mettent à jour automatiquement

### Gestion des transactions
1. **Ajouter une transaction** :
   - Cliquez sur le bouton "Add" vert
   - Sélectionnez le type (Revenu/Dépense)
   - Entrez la sous-catégorie
   - Saisissez le montant
   - Cliquez sur "Soumettre"

2. **Filtrer les transactions** :
   - Utilisez le menu déroulant "Filtrer par type"
   - Options : Tous, Revenu, Dépense

3. **Supprimer une transaction** :
   - Cliquez sur l'icône poubelle rouge
   - La transaction sera marquée comme supprimée

## 🎨 Fonctionnalités visuelles

### Couleurs et design
- **Revenus** : Vert (#4CAF50) - Croissance positive
- **Dépenses** : Rouge (#f44336) - Attention aux coûts
- **Actif net** : Bleu (#2196F3) - Situation financière globale

### Animations
- **Hover effects** : Les cartes s'élèvent au survol
- **Transitions fluides** : Changements d'état en douceur
- **Loading states** : Indicateurs de chargement

## 🔧 Fonctionnalités techniques

### Validation des données
- **Frontend** : Validation en temps réel des formulaires
- **Backend** : Validation serveur des données
- **Messages d'erreur** : Feedback clair pour l'utilisateur

### Performance
- **Index de base de données** : Requêtes optimisées
- **Cache** : Mise en cache des statistiques
- **Responsive** : Interface adaptative

## 📊 API Endpoints

### GET /historiques
Récupère la liste des transactions
```bash
curl http://localhost:8002/historiques
```

### POST /add_historique
Ajoute une nouvelle transaction
```bash
curl -X POST http://localhost:8002/add_historique \
  -H "Content-Type: application/json" \
  -d '{"type":"revenu","sous_categorie":"salaire","montant":500000}'
```

### GET /stats
Récupère les statistiques financières
```bash
curl http://localhost:8002/stats
```

## 🧪 Tests

### Test automatique
```bash
python3 test_app.py
```

### Test manuel
1. Vérifiez que l'interface se charge
2. Testez l'ajout d'une transaction
3. Vérifiez le filtrage
4. Testez la suppression

## 🐛 Dépannage

### Problèmes courants

**L'application ne se lance pas** :
- Vérifiez que MongoDB est démarré
- Vérifiez que les ports 8002 et 8080 sont libres
- Installez les dépendances avec `pip install -r requirements.txt`

**Erreur de base de données** :
- Vérifiez la connexion MongoDB
- Relancez `python3 api/utils/db_init.py`

**Interface ne se charge pas** :
- Vérifiez que le serveur frontend est démarré
- Ouvrez http://localhost:8080 dans votre navigateur

## 📈 Améliorations futures

- [ ] Authentification utilisateur
- [ ] Export PDF/Excel
- [ ] Graphiques avancés
- [ ] Notifications
- [ ] Mode sombre
- [ ] Sauvegarde automatique

## 💡 Conseils d'utilisation

1. **Organisez vos catégories** : Utilisez des sous-catégories claires
2. **Saisissez régulièrement** : Mettez à jour vos transactions quotidiennement
3. **Analysez vos données** : Consultez le dashboard pour comprendre vos habitudes
4. **Filtrez par période** : Utilisez les filtres pour analyser des périodes spécifiques

## 🆘 Support

En cas de problème :
1. Consultez ce guide
2. Vérifiez les logs d'erreur
3. Testez avec `python3 test_app.py`
4. Redémarrez l'application

---

**Bon usage de votre gestionnaire financier ! 💰**

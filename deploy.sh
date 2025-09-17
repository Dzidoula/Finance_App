#!/bin/bash

# Script de déploiement pour l'application de gestion financière
echo "🚀 Déploiement de l'application de gestion financière"
echo "=================================================="

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé"
    exit 1
fi

# Vérifier si pip est installé
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 n'est pas installé"
    exit 1
fi

# Installer les dépendances Python
echo "📦 Installation des dépendances Python..."
pip3 install -r requirements.txt

# Installer les dépendances frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
if [ -f package.json ]; then
    npm install
else
    echo "⚠️  package.json non trouvé, création d'un fichier de base..."
    cat > package.json << EOF
{
  "name": "finance-frontend",
  "version": "1.0.0",
  "description": "Frontend pour l'application de gestion financière",
  "main": "index.html",
  "scripts": {
    "start": "python3 -m http.server 8080",
    "dev": "python3 -m http.server 8080"
  },
  "dependencies": {
    "chart.js": "^4.0.0"
  }
}
EOF
    npm install
fi
cd ..

# Rendre les scripts exécutables
chmod +x start_app.py
chmod +x test_app.py

echo "✅ Déploiement terminé!"
echo ""
echo "Pour démarrer l'application:"
echo "  python3 start_app.py"
echo ""
echo "Pour tester l'application:"
echo "  python3 test_app.py"
echo ""
echo "Pour initialiser la base de données:"
echo "  cd api && python3 utils/db_init.py"

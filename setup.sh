#!/bin/bash

echo "🔧 PlombierPro V0 - Installation automatique"
echo "============================================="

# Vérification des prérequis
echo "📋 Vérification des prérequis..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Installation des dépendances
echo ""
echo "📦 Installation des dépendances backend..."
cd backend && npm install

echo ""
echo "📦 Installation des dépendances frontend..."
cd ../frontend && npm install

# Configuration
echo ""
echo "⚙️ Configuration de l'environnement..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Fichier .env créé"
else
    echo "ℹ️ Fichier .env existe déjà"
fi

# Configuration de la base de données
echo ""
echo "🛠️ Configuration de la base MongoDB..."
node scripts/setup-db.js

# Installation de concurrently globalement si nécessaire
if ! command -v concurrently &> /dev/null; then
    echo "📦 Installation de concurrently..."
    npm install -g concurrently
fi

echo ""
echo "🚀 Lancement de l'application..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""

# Lancement des serveurs
cd ..
concurrently "npm --prefix backend run dev" "npm --prefix frontend run dev"

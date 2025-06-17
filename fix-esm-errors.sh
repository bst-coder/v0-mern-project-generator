#!/bin/bash

echo "🔧 Correction automatique des erreurs ES Modules"
echo "================================================"

# Définir le répertoire du projet
PROJECT_DIR="backend"

# 1. Créer le dossier uploads s'il n'existe pas
echo "📁 Création du dossier uploads..."
mkdir -p "$PROJECT_DIR/uploads"

# 2. Vérifier que tous les imports ont les bonnes extensions
echo "🔍 Vérification des extensions d'imports..."
find "$PROJECT_DIR/src" -name "*.js" -exec sed -i -E "s/from '(\.[^']*[^s])';/from '\1.js';/g" {} \;

# 3. Vérifier les permissions
echo "🔐 Vérification des permissions..."
chmod +x setup.sh

# 4. Nettoyer les node_modules et réinstaller
echo "🧹 Nettoyage et réinstallation des dépendances..."
cd "$PROJECT_DIR"
rm -rf node_modules package-lock.json
npm install

# 5. Vérifier la configuration
echo "⚙️ Vérification de la configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️ Fichier .env manquant, création à partir de .env.example"
    cp .env.example .env
fi

# 6. Test de syntaxe
echo "🧪 Test de syntaxe des fichiers..."
for file in $(find src -name "*.js"); do
    if ! node --check "$file" 2>/dev/null; then
        echo "❌ Erreur de syntaxe dans: $file"
    fi
done

echo "✅ Corrections terminées!"
echo "🚀 Vous pouvez maintenant lancer: npm run dev"

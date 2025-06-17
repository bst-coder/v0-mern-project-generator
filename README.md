# PlombierPro V0 🔧

Plateforme de mise en relation entre clients et plombiers professionnels.

## 🚀 Démarrage rapide

\`\`\`bash
# Cloner le projet
git clone <repository-url>
cd PlombierPro

# Lancer l'installation automatique
chmod +x setup.sh
./setup.sh
\`\`\`

## 📋 Prérequis

- Node.js (v18+)
- npm ou yarn
- MongoDB (local ou Atlas)
- Docker (optionnel)

## 🛠️ Installation manuelle

### 1. Installation des dépendances

\`\`\`bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
\`\`\`

### 2. Configuration

\`\`\`bash
# Copier le fichier d'environnement
cp backend/.env.example backend/.env
\`\`\`

Modifier \`backend/.env\` avec vos paramètres :

\`\`\`env
DB_URI=mongodb://localhost:27017/plombierpro
JWT_SECRET=votre_secret_jwt_super_securise
PORT=5000
STRIPE_SECRET_KEY=sk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=votre@email.com
EMAIL_PASS=votre_mot_de_passe
\`\`\`

### 3. Configuration de la base de données

\`\`\`bash
cd backend
node scripts/setup-db.js
\`\`\`

### 4. Lancement

\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
\`\`\`

## 🐳 Avec Docker

\`\`\`bash
docker-compose up -d
\`\`\`

## 📱 Fonctionnalités

### Pour les clients
- ✅ Recherche de plombiers par localisation
- ✅ Consultation des profils et avis
- ✅ Prise de rendez-vous en ligne
- ✅ Paiement sécurisé
- ✅ Suivi des interventions

### Pour les plombiers
- ✅ Création de profil professionnel
- ✅ Gestion du planning
- ✅ Réception des demandes
- ✅ Facturation intégrée
- ✅ Gestion des avis clients

## 🏗️ Architecture

\`\`\`
PlombierPro/
├─ backend/          # API Express.js
├─ frontend/         # Interface Vue.js
├─ docs/            # Documentation
└─ docker-compose.yml
\`\`\`

## 🔧 Scripts disponibles

\`\`\`bash
# Backend
npm run dev          # Développement avec nodemon
npm run start        # Production
npm run test         # Tests unitaires

# Frontend
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
\`\`\`

## 📚 Documentation

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (\`git checkout -b feature/nouvelle-fonctionnalite\`)
3. Commit (\`git commit -am 'Ajout nouvelle fonctionnalité'\`)
4. Push (\`git push origin feature/nouvelle-fonctionnalite\`)
5. Créer une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.
\`\`\`

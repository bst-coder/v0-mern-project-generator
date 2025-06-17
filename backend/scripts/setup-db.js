import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Configuration de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, "..", ".env") })

// Import des modèles
import User from "../src/models/User.js"
import Plumber from "../src/models/Plumber.js"
import Review from "../src/models/Review.js"

const setupDatabase = async () => {
  try {
    console.log("🔗 Connexion à MongoDB...")
    await mongoose.connect(process.env.DB_URI)
    console.log("✅ Connexion réussie à MongoDB")

    // Supprimer les données existantes (optionnel)
    console.log("🧹 Nettoyage des données existantes...")
    await User.deleteMany({})
    await Plumber.deleteMany({})
    await Review.deleteMany({})

    // Créer des utilisateurs de test
    console.log("👥 Création des utilisateurs de test...")

    // Client de test
    const testClient = new User({
      firstName: "Jean",
      lastName: "Dupont",
      email: "client@test.com",
      password: "password123",
      phone: "0123456789",
      role: "client",
      isVerified: true,
      address: {
        street: "123 Rue de la Paix",
        city: "Paris",
        zipCode: "75001",
        coordinates: { lat: 48.8566, lng: 2.3522 },
      },
    })
    await testClient.save()

    // Plombier de test
    const testPlumberUser = new User({
      firstName: "Pierre",
      lastName: "Martin",
      email: "plombier@test.com",
      password: "password123",
      phone: "0987654321",
      role: "plumber",
      isVerified: true,
      address: {
        street: "456 Avenue des Artisans",
        city: "Paris",
        zipCode: "75002",
        coordinates: { lat: 48.8606, lng: 2.3376 },
      },
    })
    await testPlumberUser.save()

    // Profil plombier
    const testPlumber = new Plumber({
      user: testPlumberUser._id,
      businessName: "Martin Plomberie",
      siret: "12345678901234",
      specialties: ["plomberie-generale", "chauffage", "depannage-urgence"],
      experience: 10,
      hourlyRate: 45,
      serviceArea: {
        cities: ["Paris", "Boulogne-Billancourt", "Neuilly-sur-Seine"],
        radius: 25,
      },
      availability: {
        monday: { start: "08:00", end: "18:00", available: true },
        tuesday: { start: "08:00", end: "18:00", available: true },
        wednesday: { start: "08:00", end: "18:00", available: true },
        thursday: { start: "08:00", end: "18:00", available: true },
        friday: { start: "08:00", end: "18:00", available: true },
        saturday: { start: "09:00", end: "17:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false },
      },
      rating: {
        average: 4.8,
        count: 127,
      },
      isVerified: true,
      isActive: true,
    })
    await testPlumber.save()

    // Admin de test
    const testAdmin = new User({
      firstName: "Admin",
      lastName: "PlombierPro",
      email: "admin@plombierpro.com",
      password: "admin123",
      phone: "0100000000",
      role: "admin",
      isVerified: true,
    })
    await testAdmin.save()

    console.log("✅ Base de données configurée avec succès !")
    console.log("📧 Comptes de test créés :")
    console.log("   Client: client@test.com / password123")
    console.log("   Plombier: plombier@test.com / password123")
    console.log("   Admin: admin@plombierpro.com / admin123")
  } catch (error) {
    console.error("❌ Erreur lors de la configuration:", error)
  } finally {
    await mongoose.connection.close()
    console.log("🔌 Connexion fermée")
  }
}

setupDatabase()

import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Configuration de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

import connectDB from "./config/database.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import plumberRoutes from "./routes/plumbers.js"
import appointmentRoutes from "./routes/appointments.js"
import paymentRoutes from "./routes/payments.js"
import errorHandler from "./middlewares/errorHandler.js"

const app = express()
const PORT = process.env.PORT || 5000

// Connexion à la base de données
connectDB()

// Middlewares de sécurité
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)

// Après les middlewares de sécurité, ajouter :
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
})
app.use(limiter)

// Middlewares
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/plumbers", plumberRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/payments", paymentRoutes)

// Route de test
app.get("/api/health", (req, res) => {
  res.json({
    message: "PlombierPro API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
})

// Middleware de gestion d'erreurs
app.use(errorHandler)

// Gestion des routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
})

export default app

import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { generateToken } from "../utils/tokenUtils.js"
import { sendVerificationEmail } from "../services/emailService.js"

// Inscription
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" })
    }

    // Créer l'utilisateur
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || "client",
    })

    await user.save()

    // Générer le token de vérification
    const verificationToken = generateToken({ userId: user._id }, "24h")
    user.verificationToken = verificationToken
    await user.save()

    // Envoyer l'email de vérification
    await sendVerificationEmail(user.email, verificationToken)

    // Générer le JWT
    const token = generateToken({ userId: user._id })

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Trouver l'utilisateur
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Générer le JWT
    const token = generateToken({ userId: user._id })

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Vérification d'email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(400).json({ message: "Token invalide" })
    }

    // Marquer l'utilisateur comme vérifié
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.json({ message: "Email vérifié avec succès" })
  } catch (error) {
    console.error("Erreur lors de la vérification:", error)
    res.status(400).json({ message: "Token invalide ou expiré" })
  }
}

// Profil utilisateur
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export { register, login, verifyEmail, getProfile }

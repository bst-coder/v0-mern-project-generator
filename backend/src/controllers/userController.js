import { validationResult } from "express-validator"
import User from "../models/User.js"
import Plumber from "../models/Plumber.js"
import path from "path"
import { deleteFileIfExists, getUploadsPath } from "../utils/fileUtils.js"
import { fileURLToPath } from "url"

// Configuration de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Obtenir le profil utilisateur
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Si c'est un plombier, récupérer aussi ses infos professionnelles
    let plumberProfile = null
    if (user.role === "plumber") {
      plumberProfile = await Plumber.findOne({ user: user._id }).populate("reviews")
    }

    res.json({
      user,
      plumberProfile,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Mettre à jour le profil
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { firstName, lastName, phone, address } = req.body

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Mettre à jour les champs
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (phone) user.phone = phone
    if (address) user.address = address

    await user.save()

    res.json({
      message: "Profil mis à jour avec succès",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Supprimer l'ancien avatar s'il existe
    if (user.avatar) {
      const oldAvatarPath = path.join(getUploadsPath(), user.avatar)
      deleteFileIfExists(oldAvatarPath)
    }

    // Sauvegarder le nouveau chemin
    user.avatar = req.file.filename
    await user.save()

    res.json({
      message: "Avatar mis à jour avec succès",
      avatar: `/uploads/${req.file.filename}`,
    })
  } catch (error) {
    console.error("Erreur lors de l'upload:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Supprimer le compte
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Si c'est un plombier, supprimer aussi son profil professionnel
    if (user.role === "plumber") {
      await Plumber.findOneAndDelete({ user: user._id })
    }

    await User.findByIdAndDelete(req.user.userId)

    res.json({ message: "Compte supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export { getProfile, updateProfile, uploadAvatar, deleteAccount }

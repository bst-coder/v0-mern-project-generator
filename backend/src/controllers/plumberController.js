import { validationResult } from "express-validator"
import Plumber from "../models/Plumber.js"
import Appointment from "../models/Appointment.js"

// Obtenir tous les plombiers
const getAllPlumbers = async (req, res) => {
  try {
    const { page = 1, limit = 10, specialty, city, minRating } = req.query

    const query = { isActive: true, isVerified: true }

    if (specialty) {
      query.specialties = { $in: [specialty] }
    }

    if (city) {
      query["serviceArea.cities"] = { $in: [city] }
    }

    if (minRating) {
      query["rating.average"] = { $gte: Number.parseFloat(minRating) }
    }

    const plumbers = await Plumber.find(query)
      .populate("user", "firstName lastName avatar address")
      .sort({ "rating.average": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Plumber.countDocuments(query)

    res.json({
      plumbers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des plombiers:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Obtenir un plombier par ID
const getPlumberById = async (req, res) => {
  try {
    const plumber = await Plumber.findById(req.params.id)
      .populate("user", "firstName lastName avatar address phone")
      .populate({
        path: "reviews",
        populate: {
          path: "client",
          select: "firstName lastName avatar",
        },
      })

    if (!plumber) {
      return res.status(404).json({ message: "Plombier non trouvé" })
    }

    res.json({ plumber })
  } catch (error) {
    console.error("Erreur lors de la récupération du plombier:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Créer un profil plombier
const createPlumberProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Vérifier si l'utilisateur a déjà un profil plombier
    const existingPlumber = await Plumber.findOne({ user: req.user.userId })
    if (existingPlumber) {
      return res.status(400).json({ message: "Profil plombier déjà existant" })
    }

    const { businessName, siret, specialties, experience, hourlyRate, serviceArea, availability, certifications } =
      req.body

    const plumber = new Plumber({
      user: req.user.userId,
      businessName,
      siret,
      specialties,
      experience,
      hourlyRate,
      serviceArea,
      availability,
      certifications,
    })

    await plumber.save()

    res.status(201).json({
      message: "Profil plombier créé avec succès",
      plumber,
    })
  } catch (error) {
    console.error("Erreur lors de la création du profil:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Mettre à jour le profil plombier
const updatePlumberProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const plumber = await Plumber.findOne({ user: req.user.userId })
    if (!plumber) {
      return res.status(404).json({ message: "Profil plombier non trouvé" })
    }

    const updateFields = [
      "businessName",
      "specialties",
      "experience",
      "hourlyRate",
      "serviceArea",
      "availability",
      "certifications",
      "portfolio",
    ]

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        plumber[field] = req.body[field]
      }
    })

    await plumber.save()

    res.json({
      message: "Profil mis à jour avec succès",
      plumber,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Rechercher des plombiers
const searchPlumbers = async (req, res) => {
  try {
    const { service, location, urgency, page = 1, limit = 10 } = req.query

    const query = { isActive: true, isVerified: true }

    if (service) {
      query.specialties = { $in: [service] }
    }

    if (location) {
      query["serviceArea.cities"] = { $regex: location, $options: "i" }
    }

    const plumbers = await Plumber.find(query)
      .populate("user", "firstName lastName avatar address")
      .sort({ "rating.average": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Plumber.countDocuments(query)

    res.json({
      plumbers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      searchParams: { service, location, urgency },
    })
  } catch (error) {
    console.error("Erreur lors de la recherche:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Obtenir les rendez-vous d'un plombier
const getPlumberAppointments = async (req, res) => {
  try {
    const plumber = await Plumber.findOne({ user: req.user.userId })
    if (!plumber) {
      return res.status(404).json({ message: "Profil plombier non trouvé" })
    }

    const { status, page = 1, limit = 10 } = req.query
    const query = { plumber: plumber._id }

    if (status) {
      query.status = status
    }

    const appointments = await Appointment.find(query)
      .populate("client", "firstName lastName phone avatar")
      .sort({ scheduledDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Appointment.countDocuments(query)

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Mettre à jour les disponibilités
const updateAvailability = async (req, res) => {
  try {
    const plumber = await Plumber.findOne({ user: req.user.userId })
    if (!plumber) {
      return res.status(404).json({ message: "Profil plombier non trouvé" })
    }

    plumber.availability = req.body.availability
    await plumber.save()

    res.json({
      message: "Disponibilités mises à jour",
      availability: plumber.availability,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export {
  getAllPlumbers,
  getPlumberById,
  createPlumberProfile,
  updatePlumberProfile,
  searchPlumbers,
  getPlumberAppointments,
  updateAvailability,
}

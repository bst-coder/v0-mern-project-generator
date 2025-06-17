import { validationResult } from "express-validator"
import Appointment from "../models/Appointment.js"
import Plumber from "../models/Plumber.js"
import Review from "../models/Review.js"
import { sendAppointmentNotification } from "../services/emailService.js"

// Créer un rendez-vous
const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { plumber, service, description, scheduledDate, address, urgency, estimatedPrice } = req.body

    // Vérifier que le plombier existe
    const plumberProfile = await Plumber.findById(plumber).populate("user")
    if (!plumberProfile) {
      return res.status(404).json({ message: "Plombier non trouvé" })
    }

    // Créer le rendez-vous
    const appointment = new Appointment({
      client: req.user.userId,
      plumber,
      service,
      description,
      scheduledDate: new Date(scheduledDate),
      address,
      urgency: urgency || "medium",
      estimatedPrice,
    })

    await appointment.save()

    // Peupler les données pour la réponse
    await appointment.populate("client", "firstName lastName phone")
    await appointment.populate({
      path: "plumber",
      populate: {
        path: "user",
        select: "firstName lastName phone email",
      },
    })

    // Envoyer une notification par email au plombier
    try {
      await sendAppointmentNotification(appointment.plumber.user.email, appointment)
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError)
    }

    res.status(201).json({
      message: "Rendez-vous créé avec succès",
      appointment,
    })
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Obtenir les rendez-vous de l'utilisateur
const getUserAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { client: req.user.userId }

    if (status) {
      query.status = status
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: "plumber",
        populate: {
          path: "user",
          select: "firstName lastName avatar phone",
        },
      })
      .populate("review")
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

// Obtenir un rendez-vous par ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("client", "firstName lastName phone avatar")
      .populate({
        path: "plumber",
        populate: {
          path: "user",
          select: "firstName lastName phone avatar",
        },
      })
      .populate("review")

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" })
    }

    // Vérifier que l'utilisateur a accès à ce rendez-vous
    const plumberProfile = await Plumber.findById(appointment.plumber._id)
    const isOwner = appointment.client._id.toString() === req.user.userId
    const isPlumber = plumberProfile && plumberProfile.user.toString() === req.user.userId

    if (!isOwner && !isPlumber) {
      return res.status(403).json({ message: "Accès refusé" })
    }

    res.json({ appointment })
  } catch (error) {
    console.error("Erreur lors de la récupération du rendez-vous:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Mettre à jour le statut d'un rendez-vous
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, finalPrice, notes } = req.body
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" })
    }

    // Vérifier les permissions
    const plumberProfile = await Plumber.findById(appointment.plumber)
    const isPlumber = plumberProfile && plumberProfile.user.toString() === req.user.userId
    const isClient = appointment.client.toString() === req.user.userId

    if (!isPlumber && !isClient) {
      return res.status(403).json({ message: "Accès refusé" })
    }

    // Mettre à jour le statut
    appointment.status = status
    if (finalPrice) appointment.finalPrice = finalPrice
    if (notes) {
      if (isPlumber) {
        appointment.notes.plumber = notes
      } else {
        appointment.notes.client = notes
      }
    }

    await appointment.save()

    res.json({
      message: "Statut mis à jour avec succès",
      appointment,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Annuler un rendez-vous
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" })
    }

    // Vérifier que l'utilisateur peut annuler
    const plumberProfile = await Plumber.findById(appointment.plumber)
    const isPlumber = plumberProfile && plumberProfile.user.toString() === req.user.userId
    const isClient = appointment.client.toString() === req.user.userId

    if (!isPlumber && !isClient) {
      return res.status(403).json({ message: "Accès refusé" })
    }

    appointment.status = "cancelled"
    await appointment.save()

    res.json({ message: "Rendez-vous annulé avec succès" })
  } catch (error) {
    console.error("Erreur lors de l'annulation:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Ajouter un avis
const addReview = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" })
    }

    // Vérifier que c'est le client et que le rendez-vous est terminé
    if (appointment.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Seul le client peut laisser un avis" })
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ message: "Le rendez-vous doit être terminé" })
    }

    if (appointment.review) {
      return res.status(400).json({ message: "Avis déjà donné" })
    }

    const { rating, comment } = req.body

    // Créer l'avis
    const review = new Review({
      client: req.user.userId,
      plumber: appointment.plumber,
      appointment: appointment._id,
      rating,
      comment,
    })

    await review.save()

    // Lier l'avis au rendez-vous
    appointment.review = review._id
    await appointment.save()

    // Mettre à jour la note moyenne du plombier
    const plumber = await Plumber.findById(appointment.plumber)
    const reviews = await Review.find({ plumber: plumber._id })
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)

    plumber.rating.average = totalRating / reviews.length
    plumber.rating.count = reviews.length
    plumber.reviews.push(review._id)

    await plumber.save()

    res.status(201).json({
      message: "Avis ajouté avec succès",
      review,
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'avis:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  addReview,
}

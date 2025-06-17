import stripe from "../config/stripe.js"
import Appointment from "../models/Appointment.js"

// Créer un intent de paiement
const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body

    const appointment = await Appointment.findById(appointmentId).populate("client").populate("plumber")

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" })
    }

    // Vérifier que c'est le client du rendez-vous
    if (appointment.client._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès refusé" })
    }

    const amount = Math.round((appointment.finalPrice || appointment.estimatedPrice) * 100) // en centimes

    // Créer l'intent de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      metadata: {
        appointmentId: appointment._id.toString(),
        clientId: appointment.client._id.toString(),
        plumberId: appointment.plumber._id.toString(),
      },
    })

    // Sauvegarder l'ID de l'intent
    appointment.payment.stripePaymentIntentId = paymentIntent.id
    await appointment.save()

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    })
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Confirmer le paiement
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body

    // Récupérer l'intent de paiement depuis Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === "succeeded") {
      // Mettre à jour le rendez-vous
      const appointment = await Appointment.findById(paymentIntent.metadata.appointmentId)

      if (appointment) {
        appointment.payment.status = "paid"
        appointment.payment.paidAt = new Date()
        await appointment.save()
      }

      res.json({
        message: "Paiement confirmé avec succès",
        status: "succeeded",
      })
    } else {
      res.status(400).json({
        message: "Paiement non confirmé",
        status: paymentIntent.status,
      })
    }
  } catch (error) {
    console.error("Erreur lors de la confirmation:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Historique des paiements
const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const appointments = await Appointment.find({
      client: req.user.userId,
      "payment.status": "paid",
    })
      .populate({
        path: "plumber",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      })
      .sort({ "payment.paidAt": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Appointment.countDocuments({
      client: req.user.userId,
      "payment.status": "paid",
    })

    res.json({
      payments: appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// Remboursement
const refundPayment = async (req, res) => {
  try {
    const { appointmentId, reason } = req.body

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" })
    }

    if (appointment.payment.status !== "paid") {
      return res.status(400).json({ message: "Aucun paiement à rembourser" })
    }

    // Créer le remboursement sur Stripe
    const refund = await stripe.refunds.create({
      payment_intent: appointment.payment.stripePaymentIntentId,
      reason: "requested_by_customer",
      metadata: {
        appointmentId: appointment._id.toString(),
        reason,
      },
    })

    // Mettre à jour le statut
    appointment.payment.status = "refunded"
    appointment.status = "cancelled"
    await appointment.save()

    res.json({
      message: "Remboursement effectué avec succès",
      refundId: refund.id,
    })
  } catch (error) {
    console.error("Erreur lors du remboursement:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export { createPaymentIntent, confirmPayment, getPaymentHistory, refundPayment }

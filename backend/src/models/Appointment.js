import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plumber",
      required: true,
    },
    service: {
      type: String,
      required: true,
      enum: [
        "plomberie-generale",
        "chauffage",
        "sanitaire",
        "depannage-urgence",
        "installation-salle-bain",
        "debouchage",
        "fuite-eau",
        "chauffe-eau",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60, // minutes
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "emergency"],
      default: "medium",
    },
    estimatedPrice: {
      type: Number,
      min: 0,
    },
    finalPrice: {
      type: Number,
      min: 0,
    },
    images: [String],
    notes: {
      client: String,
      plumber: String,
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending",
      },
      stripePaymentIntentId: String,
      paidAt: Date,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  {
    timestamps: true,
  },
)

// Index pour les requêtes fréquentes
appointmentSchema.index({ client: 1, status: 1 })
appointmentSchema.index({ plumber: 1, status: 1 })
appointmentSchema.index({ scheduledDate: 1 })

export default mongoose.model("Appointment", appointmentSchema)

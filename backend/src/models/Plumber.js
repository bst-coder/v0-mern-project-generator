import mongoose from "mongoose"

const plumberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    siret: {
      type: String,
      required: true,
      unique: true,
    },
    specialties: [
      {
        type: String,
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
    ],
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    serviceArea: {
      cities: [String],
      radius: {
        type: Number,
        default: 25, // km
      },
    },
    availability: {
      monday: { start: String, end: String, available: Boolean },
      tuesday: { start: String, end: String, available: Boolean },
      wednesday: { start: String, end: String, available: Boolean },
      thursday: { start: String, end: String, available: Boolean },
      friday: { start: String, end: String, available: Boolean },
      saturday: { start: String, end: String, available: Boolean },
      sunday: { start: String, end: String, available: Boolean },
    },
    portfolio: [
      {
        title: String,
        description: String,
        images: [String],
        date: Date,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        expiryDate: Date,
        document: String,
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stripeAccountId: String,
  },
  {
    timestamps: true,
  },
)

// Index pour la recherche géographique
plumberSchema.index({ "serviceArea.cities": 1 })
plumberSchema.index({ specialties: 1 })
plumberSchema.index({ "rating.average": -1 })

export default mongoose.model("Plumber", plumberSchema)

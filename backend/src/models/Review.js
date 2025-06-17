import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      comment: String,
      date: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index pour éviter les doublons
reviewSchema.index({ client: 1, appointment: 1 }, { unique: true })

export default mongoose.model("Review", reviewSchema)

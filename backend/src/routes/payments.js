import express from "express"
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
} from "../controllers/paymentController.js"
import auth from "../middlewares/auth.js"

const router = express.Router()

// Routes
router.post("/create-intent", auth, createPaymentIntent)
router.post("/confirm", auth, confirmPayment)
router.get("/history", auth, getPaymentHistory)
router.post("/refund", auth, refundPayment)

export default router

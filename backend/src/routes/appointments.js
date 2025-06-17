import express from "express"
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  addReview,
} from "../controllers/appointmentController.js"
import auth from "../middlewares/auth.js"
import { appointmentValidation, reviewValidation, handleValidationErrors } from "../middlewares/validation.js"

const router = express.Router()

// Routes
router.post("/", auth, appointmentValidation, handleValidationErrors, createAppointment)
router.get("/", auth, getUserAppointments)
router.get("/:id", auth, getAppointmentById)
router.put("/:id/status", auth, updateAppointmentStatus)
router.delete("/:id", auth, cancelAppointment)
router.post("/:id/review", auth, reviewValidation, handleValidationErrors, addReview)

export default router

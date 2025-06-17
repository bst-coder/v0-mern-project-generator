import express from "express"
import {
  getAllPlumbers,
  getPlumberById,
  createPlumberProfile,
  updatePlumberProfile,
  searchPlumbers,
  getPlumberAppointments,
  updateAvailability,
} from "../controllers/plumberController.js"
import auth from "../middlewares/auth.js"
import { requireRole } from "../middlewares/roleCheck.js"
import { plumberValidation, handleValidationErrors } from "../middlewares/validation.js"

const router = express.Router()

// Routes publiques
router.get("/", getAllPlumbers)
router.get("/search", searchPlumbers)
router.get("/:id", getPlumberById)

// Routes protégées
router.post("/profile", auth, requireRole("plumber"), plumberValidation, handleValidationErrors, createPlumberProfile)
router.put("/profile", auth, requireRole("plumber"), plumberValidation, handleValidationErrors, updatePlumberProfile)
router.get("/profile/appointments", auth, requireRole("plumber"), getPlumberAppointments)
router.put("/availability", auth, requireRole("plumber"), updateAvailability)

export default router

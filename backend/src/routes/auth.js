import express from "express"
import { register, login, verifyEmail, getProfile } from "../controllers/authController.js"
import auth from "../middlewares/auth.js"
import { registerValidation, loginValidation, handleValidationErrors } from "../middlewares/validation.js"

const router = express.Router()

// Routes
router.post("/register", registerValidation, handleValidationErrors, register)
router.post("/login", loginValidation, handleValidationErrors, login)
router.get("/verify/:token", verifyEmail)
router.get("/profile", auth, getProfile)

export default router

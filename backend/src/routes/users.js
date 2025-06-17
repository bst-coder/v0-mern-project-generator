import express from "express"
import { getProfile, updateProfile, uploadAvatar, deleteAccount } from "../controllers/userController.js"
import auth from "../middlewares/auth.js"
import upload from "../middlewares/upload.js"
import { updateProfileValidation, handleValidationErrors } from "../middlewares/validation.js"

const router = express.Router()

// Routes
router.get("/profile", auth, getProfile)
router.put("/profile", auth, updateProfileValidation, handleValidationErrors, updateProfile)
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar)
router.delete("/account", auth, deleteAccount)

export default router

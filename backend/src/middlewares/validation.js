import { body, validationResult } from "express-validator"

// Validation pour l'inscription
export const registerValidation = [
  body("firstName").trim().isLength({ min: 2 }).withMessage("Le prénom doit contenir au moins 2 caractères"),
  body("lastName").trim().isLength({ min: 2 }).withMessage("Le nom doit contenir au moins 2 caractères"),
  body("email").isEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("phone").isMobilePhone("fr-FR").withMessage("Numéro de téléphone invalide"),
  body("role").optional().isIn(["client", "plumber"]).withMessage("Rôle invalide"),
]

// Validation pour la connexion
export const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
]

// Validation pour la mise à jour du profil
export const updateProfileValidation = [
  body("firstName").optional().trim().isLength({ min: 2 }),
  body("lastName").optional().trim().isLength({ min: 2 }),
  body("phone").optional().isMobilePhone("fr-FR"),
]

// Validation pour le profil plombier
export const plumberValidation = [
  body("businessName").trim().isLength({ min: 2 }).withMessage("Nom de l'entreprise requis"),
  body("siret").isLength({ min: 14, max: 14 }).withMessage("SIRET invalide"),
  body("specialties").isArray({ min: 1 }).withMessage("Au moins une spécialité requise"),
  body("experience").isInt({ min: 0 }).withMessage("Expérience invalide"),
  body("hourlyRate").isFloat({ min: 0 }).withMessage("Tarif horaire invalide"),
]

// Validation pour les rendez-vous
export const appointmentValidation = [
  body("plumber").isMongoId().withMessage("ID plombier invalide"),
  body("service").notEmpty().withMessage("Service requis"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description trop courte"),
  body("scheduledDate").isISO8601().withMessage("Date invalide"),
  body("address.street").notEmpty().withMessage("Adresse requise"),
  body("address.city").notEmpty().withMessage("Ville requise"),
  body("address.zipCode").notEmpty().withMessage("Code postal requis"),
]

// Validation pour les avis
export const reviewValidation = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Note entre 1 et 5"),
  body("comment").trim().isLength({ min: 10 }).withMessage("Commentaire trop court"),
]

// Middleware pour vérifier les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      message: "Erreur de validation",
      errors,
    })
  }

  // Erreur de duplication MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      message: `${field} déjà utilisé`,
    })
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Token invalide",
    })
  }

  // Erreur par défaut
  res.status(500).json({
    message: "Erreur serveur interne",
  })
}

export default errorHandler

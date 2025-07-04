import jwt from "jsonwebtoken"
import User from "../models/User.js"

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token invalide." })
    }

    req.user = { userId: user._id, role: user.role }
    next()
  } catch (error) {
    res.status(401).json({ message: "Token invalide." })
  }
}

export default auth

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        message: `Accès refusé. Rôle ${role} requis.`,
      })
    }
    next()
  }
}

const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Accès refusé. Un des rôles suivants requis: ${roles.join(", ")}`,
      })
    }
    next()
  }
}

export { requireRole, requireRoles }

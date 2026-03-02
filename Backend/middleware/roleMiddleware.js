export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("User role:", req.user?.role);
    console.log("Allowed roles:", roles);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role (${req.user.role}) not allowed.`,
      });
    }
    next();
  };
};
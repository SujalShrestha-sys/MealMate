import { verifyToken } from "../utils/jwt.js";

export const AuthenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = verifyToken(token);
    req.user = decodedToken;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Invalid Token!",
    });
  }
};

export const AuthorizeRoles = ([...roles]) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access denied",
      });
    }

    next();
  };
};

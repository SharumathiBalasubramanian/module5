const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ==========================================
// PROTECT
// ==========================================

const protect = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization header missing",
      });
    }

    if (
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid token payload",
      });
    }

    const user =
      await User.findById(decoded.id).select(
        "-password"
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account no longer exists",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Token verification failed or expired",
    });
  }
};

// ==========================================
// AUTHORIZE ROLE
// ==========================================

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated",
      });
    }

    if (
      !roles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          `Forbidden: role '${req.user.role}' is not authorized`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
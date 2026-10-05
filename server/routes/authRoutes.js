const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/authentication");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// CURRENT USER
router.get("/me", protect, getMe);

// TEST
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth route is working",
  });
});

module.exports = router;
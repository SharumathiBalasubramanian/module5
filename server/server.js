require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/dbConnection");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ecommerceclientz.netlify.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow tools like Postman, curl, or server-to-server requests
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("CORS blocked origin:", origin);
    return callback(null, false);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

// Global CORS middleware handles both standard and OPTIONS preflight requests
app.use(cors(corsOptions));

// --------------------------------------------------
// BODY PARSER
// --------------------------------------------------

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --------------------------------------------------
// TEST ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AURA GOODS API is running",
  });
});

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// --------------------------------------------------
// 404
// --------------------------------------------------

// In Express 5, use regular middleware without '*' for fallback 404
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Endpoint not found: ${req.originalUrl}`);
  next(error);
});

// --------------------------------------------------
// ERROR HANDLER
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

// --------------------------------------------------
// DATABASE + SERVER
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect MongoDB FIRST
    await connectDB();

    // Start Express AFTER MongoDB connects
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
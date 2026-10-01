
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConnection");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const userRoutes = require("./routes/userRoutes");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // and configured frontend origins
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS access denied"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    brand: "Aura Goods Studio",
    version: "2.0.0",
    status: "operational",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `[Aura Goods Server] Running on port ${PORT}`
  );

  console.log(
    `[Aura Goods Server] Allowed Origins:`,
    allowedOrigins
  );
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error(
    `[Unhandled Error] ${err.message}`
  );

  server.close(() => process.exit(1));
});


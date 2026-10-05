const mongoose = require("mongoose");
const dns = require("dns");

// Only run DNS override locally, NEVER on Render / production
if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (err) {
    console.warn("DNS override failed:", err.message);
  }
}

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!rawUri) {
      throw new Error(
        "Neither MONGO_URI nor MONGODB_URI is defined in your environment."
      );
    }

    const conn = await mongoose.connect(rawUri.trim(), {
      serverSelectionTimeoutMS: 5000, // Fails fast in 5s instead of hanging 10s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use public DNS servers that resolve SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  console.warn("DNS override failed:", err.message);
}

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!rawUri) {
      throw new Error(
        "Neither MONGO_URI nor MONGODB_URI is defined in your environment."
      );
    }

    const mongoUri = rawUri.trim();

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
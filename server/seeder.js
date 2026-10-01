const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user");
const Product = require("./models/product");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_db";

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected ✅");

    // =========================
    // CREATE / FIND ADMIN
    // =========================
    let admin = await User.findOne({
      email: "admin@example.com",
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      admin = await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin user created ✅");
    } else {
      console.log("Admin user already exists ✅");
    }

    // =========================
    // CLEAR OLD PRODUCTS
    // =========================
    await Product.deleteMany({});

    console.log("Old products removed ✅");

    // =========================
    // PRODUCTS
    // =========================
    const products = [
      {
        name: "1080p Full HD Webcam with Mic",
        description:
          "Full HD 1080p webcam with built-in microphone for video calls, meetings and streaming.",
        price: 2499,
        category: "Electronics",
        stock: 25,
        images: [
          "/images/1080p%20Full%20HD%20Webcam%20with%20Mic.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Noise-Cancelling Wireless Headphone",
        description:
          "Wireless headphones with noise cancellation and comfortable ear cushions.",
        price: 3999,
        category: "Electronics",
        stock: 20,
        images: [
          "/images/Noise-Cancelling%20Wireless%20Headphone.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Mechanical RGB Gaming Keyboard",
        description:
          "Mechanical gaming keyboard with RGB lighting and responsive keys.",
        price: 3499,
        category: "Electronics",
        stock: 30,
        images: [
          "/images/Mechanical%20RGB%20Gaming%20Keyboard.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Wireless Ergonomic Mouse",
        description:
          "Ergonomic wireless mouse designed for comfortable everyday use.",
        price: 1299,
        category: "Electronics",
        stock: 40,
        images: [
          "/images/Wireless%20Ergonomic%20Mouse.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Smart Fitness Tracker Watch",
        description:
          "Smart fitness tracker with activity monitoring and health tracking features.",
        price: 2999,
        category: "Electronics",
        stock: 25,
        images: [
          "/images/Smart%20Fitness%20Tracker%20Watch.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "20,000mAh Fast Charging Power Bank",
        description:
          "High-capacity 20000mAh power bank with fast charging support.",
        price: 1999,
        category: "Electronics",
        stock: 35,
        images: [
          "/images/20,000mAh%20Fast%20Charging%20Power%20Bank.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Foldable Aluminum Laptop Stand",
        description:
          "Adjustable and foldable aluminum laptop stand for desk use.",
        price: 1499,
        category: "Accessories",
        stock: 30,
        images: [
          "/images/Foldable%20Aluminum%20Laptop%20Stand.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "HEPA Air Purifier for Home",
        description:
          "Compact HEPA air purifier designed for cleaner indoor air.",
        price: 4999,
        category: "Home Appliances",
        stock: 15,
        images: [
          "/images/HEPA%20Air%20Purifier%20for%20Home',.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Programmable Drip Coffee Maker",
        description:
          "Programmable drip coffee maker for convenient home brewing.",
        price: 2799,
        category: "Home Appliances",
        stock: 20,
        images: [
          "/images/Programmable%20Drip%20Coffee%20Make.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Slim RFID-Blocking Leather Wallet",
        description:
          "Slim leather wallet with RFID protection for cards and cash.",
        price: 999,
        category: "Accessories",
        stock: 45,
        images: [
          "/images/Slim%20RFID-Blocking%20Leather%20Wallet.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Water-Resistant Laptop Backpack 30L",
        description:
          "30L water-resistant backpack suitable for laptops, travel and work.",
        price: 2299,
        category: "Bags",
        stock: 25,
        images: [
          "/images/Water-Resistant%20Laptop%20Backpack%2030L.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "LED Dimmable Desk Lamp with USB Port",
        description:
          "Adjustable LED desk lamp with brightness control and USB charging port.",
        price: 1199,
        category: "Home Appliances",
        stock: 30,
        images: [
          "/images/LED%20Dimmable%20Desk%20Lamp%20with%20USB%20Port.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "True Wireless Sport Earbuds",
        description:
          "Compact wireless earbuds designed for sports and everyday listening.",
        price: 1799,
        category: "Electronics",
        stock: 35,
        images: [
          "/images/True%20Wireless%20Sport%20Earbuds.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Extra Thick Eco-Friendly Yoga Mat",
        description:
          "Extra thick and comfortable eco-friendly yoga mat.",
        price: 1299,
        category: "Fitness",
        stock: 25,
        images: [
          "/images/Extra%20Thick%20Eco-Friendly%20Yoga%20Ma.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Waterproof Bluetooth Portable Speaker",
        description:
          "Portable waterproof Bluetooth speaker with powerful sound.",
        price: 2499,
        category: "Electronics",
        stock: 20,
        images: [
          "/images/Waterproof%20Bluetooth%20Portable%20Speake.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Polarized Aviator Sunglasses",
        description:
          "Classic polarized aviator sunglasses with UV protection.",
        price: 899,
        category: "Fashion",
        stock: 40,
        images: [
          "/images/Polarized%20Aviator%20Sunglasses'.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "4K Ultra HD Smart TV 55",
        description:
          "55-inch 4K Ultra HD Smart TV with modern streaming features.",
        price: 42999,
        category: "Electronics",
        stock: 10,
        images: [
          "/images/4K%20Ultra%20HD%20Smart%20TV%2055.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "High-Back Ergonomic Mesh Office Chair",
        description:
          "Ergonomic high-back office chair with breathable mesh support.",
        price: 8999,
        category: "Furniture",
        stock: 12,
        images: [
          "/images/High-Back%20Ergonomic%20Mesh%20Office%20Chair.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Smart Robot Vacuum and Mop",
        description:
          "Smart robot vacuum cleaner with automated floor cleaning and mopping.",
        price: 18999,
        category: "Home Appliances",
        stock: 8,
        images: [
          "/images/Smart%20Robot%20Vacuum%20and%20Mop.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "USB-C 7-in-1 Multiport Hub",
        description:
          "USB-C multiport hub with multiple connectivity options for laptops.",
        price: 2199,
        category: "Accessories",
        stock: 30,
        images: [
          "/images/USB-C%207-in-1%20Multiport%20Hub.jpg",
        ],
        createdBy: admin._id,
      },

      {
        name: "Foldable Aluminum Tablet Stand",
        description:
          "Adjustable foldable aluminum stand suitable for tablets and mobile devices.",
        price: 999,
        category: "Accessories",
        stock: 35,
        images: [
          "/images/Foldable%20Aluminum%20Laptop%20Stand.jpg",
        ],
        createdBy: admin._id,
      },
    ];

    // =========================
    // INSERT PRODUCTS
    // =========================
    const createdProducts = await Product.insertMany(products);

    console.log(
      `${createdProducts.length} products inserted successfully ✅`
    );

    console.log("\nAdmin Login:");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");

    console.log("\nSeeding completed successfully 🎉");

    process.exit(0);
  } catch (error) {
    console.error("Seeder Error ❌");
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
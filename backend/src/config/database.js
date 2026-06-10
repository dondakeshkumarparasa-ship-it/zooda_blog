const mongoose = require('mongoose');
const Category = require('../modules/categories/category.model');

const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log("Seeding default categories in MongoDB...");
      const defaultCategories = [
        { name: "SaaS & IoT", subcategories: [{ name: "General" }, { name: "Analytics" }, { name: "IoT Platform" }] },
        { name: "E-Commerce & Retail", subcategories: [{ name: "General" }, { name: "Fashion" }, { name: "Groceries" }, { name: "Electronics" }] },
        { name: "Healthcare & Medical", subcategories: [{ name: "General" }, { name: "Telemedicine" }, { name: "Pharmacy" }] },
        { name: "EdTech & Education", subcategories: [{ name: "General" }, { name: "LMS" }, { name: "K-12" }] },
        { name: "FinTech & Finance", subcategories: [{ name: "General" }, { name: "Banking" }, { name: "Insurance" }] },
        { name: "Food & Beverage", subcategories: [{ name: "General" }, { name: "Restaurant" }, { name: "Bakery" }, { name: "Cafe" }] },
        { name: "Real Estate & Housing", subcategories: [{ name: "General" }, { name: "Rentals" }, { name: "Property Listing" }] },
        { name: "Logistics & Transport", subcategories: [{ name: "General" }, { name: "Delivery" }, { name: "Freight" }] },
        { name: "Entertainment & Media", subcategories: [{ name: "General" }, { name: "Streaming" }, { name: "Gaming" }] },
        { name: "Other Services", subcategories: [{ name: "General" }] }
      ];
      await Category.insertMany(defaultCategories);
      console.log("Categories seeded successfully!");
    }
  } catch (err) {
    console.error("Error seeding categories:", err);
  }
};

let cachedConnection = null;

const connectDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://zoodanew_db_user:BtEKCF6787xJg0Ha@cluster0.yaecgnu.mongodb.net/?appName=Cluster0";
  
  if (mongoose.connection.readyState === 0) {
    cachedConnection = null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      bufferCommands: false,
    });
    await cachedConnection;
    console.log("MongoDB Connected Successfully");
    seedCategories().catch(err => console.error("Error seeding categories in background:", err));
  } catch (err) {
    cachedConnection = null;
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
  return mongoose.connection;
};

module.exports = connectDatabase;

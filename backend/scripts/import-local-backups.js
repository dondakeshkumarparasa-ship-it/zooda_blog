// Programmatic DNS configuration to resolve SRV records in restricted environments
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://zoodanew_db_user:BtEKCF6787xJg0Ha@cluster0.yaecgnu.mongodb.net/?appName=Cluster0";

// Import models
const Business = require('../src/modules/users/business.model');
const User = require('../src/modules/auth/auth.model');
const Post = require('../src/modules/users/post.model');
const Product = require('../src/modules/products/product.model');
const Category = require('../src/modules/categories/category.model');

const backupDir = path.join(__dirname, 'hostinger-backups');

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    console.log("URI:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!\n");

    // 1. Import Categories
    console.log("--- 1. IMPORTING CATEGORIES ---");
    const categoriesPath = path.join(backupDir, 'categories.json');
    if (fs.existsSync(categoriesPath)) {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      console.log(`Loaded ${categories.length} categories from file.`);
      
      for (const cat of categories) {
        await Category.updateOne(
          { _id: cat._id },
          { $set: { name: cat.name, subcategories: cat.subcategories } },
          { upsert: true }
        );
      }
      console.log("Categories imported successfully.\n");
    } else {
      console.log("categories.json not found, skipping.\n");
    }

    // 2. Import Users & 3. Import Businesses
    console.log("--- 2. IMPORTING USERS & MAPPING BUSINESSES ---");
    const usersPath = path.join(backupDir, 'users.json');
    const businessesPath = path.join(backupDir, 'businesses_details.json');

    if (fs.existsSync(usersPath) && fs.existsSync(businessesPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf8'));
      
      console.log(`Loaded ${users.length} users and ${businesses.length} businesses from files.`);
      
      // We will build a map of oldUserId -> actualUserId in the database to prevent duplicate emails
      const userIdMap = {};

      for (const userData of users) {
        const emailLower = userData.email.toLowerCase();
        
        // Find if user already exists by email
        let dbUser = await User.findOne({ email: emailLower });
        
        if (!dbUser) {
          // Find if user already exists by ID
          dbUser = await User.findById(userData._id);
        }

        if (!dbUser) {
          // Create new user
          try {
            const newUser = new User({
              _id: userData._id,
              firstName: userData.firstName || 'Owner',
              lastName: userData.lastName || 'Business',
              email: emailLower,
              phone: userData.phone || null,
              role: 'business_owner',
              password: 'Zooda2026!'
            });
            await newUser.save();
            dbUser = newUser;
            console.log(`  -> Created new user: ${emailLower}`);
          } catch (err) {
            console.error(`  -> Failed to create user ${emailLower}:`, err.message);
            continue;
          }
        } else {
          // Update existing user fields
          dbUser.firstName = userData.firstName || dbUser.firstName;
          dbUser.lastName = userData.lastName || dbUser.lastName;
          dbUser.role = 'business_owner';
          if (userData.phone) dbUser.phone = userData.phone;
          await dbUser.save();
          console.log(`  -> Updated existing user: ${emailLower} (${dbUser._id})`);
        }

        // Map the old user ID from backup to the actual DB user ID
        userIdMap[userData._id] = dbUser._id;
      }

      // 3. Import Businesses
      console.log("\n--- 3. IMPORTING BUSINESSES ---");
      for (const biz of businesses) {
        const businessDoc = { ...biz };
        
        // Map old user ID to actual DB user ID
        const oldUserId = biz.user && typeof biz.user === 'object' ? biz.user._id : biz.user;
        const actualUserId = userIdMap[oldUserId] || oldUserId;
        
        businessDoc.user = actualUserId;

        await Business.updateOne(
          { _id: businessDoc._id },
          { $set: businessDoc },
          { upsert: true }
        );
        console.log(`  -> Upserted business profile: ${biz.businessName}`);
      }
      console.log("Businesses imported successfully.\n");
    } else {
      console.log("users.json or businesses_details.json not found, skipping.\n");
    }

    // 4. Import Products
    console.log("--- 4. IMPORTING PRODUCTS ---");
    const productsPath = path.join(backupDir, 'products.json');
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      console.log(`Loaded ${products.length} products from file.`);
      
      let productSuccess = 0;
      let productErrors = 0;

      for (const prod of products) {
        try {
          const prodDoc = { ...prod };
          delete prodDoc.businessName;
          delete prodDoc.businessId;
          
          prodDoc.business = prod.businessId || prod.business;

          // Generate unique SKU if missing to prevent E11000 duplicate key error for { sku: null }
          if (!prodDoc.sku) {
            prodDoc.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
          }

          await Product.updateOne(
            { _id: prodDoc._id },
            { $set: prodDoc },
            { upsert: true }
          );
          productSuccess++;
        } catch (err) {
          console.error(`  -> Error importing product ${prod._id}:`, err.message);
          productErrors++;
        }
      }
      console.log(`Products imported successfully: ${productSuccess}, Failed/Skipped: ${productErrors}.\n`);
    } else {
      console.log("products.json not found, skipping.\n");
    }

    // 5. Import Posts
    console.log("--- 5. IMPORTING POSTS ---");
    const postsPath = path.join(backupDir, 'posts.json');
    if (fs.existsSync(postsPath)) {
      const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
      console.log(`Loaded ${posts.length} posts from file.`);
      
      for (const post of posts) {
        const postDoc = { ...post };
        delete postDoc.businessName;
        delete postDoc.businessId;

        if (post.user && typeof post.user === 'object') {
          postDoc.user = post.user._id;
        }
        postDoc.business = post.businessId || post.business;

        await Post.updateOne(
          { _id: postDoc._id },
          { $set: postDoc },
          { upsert: true }
        );
      }
      console.log("Posts imported successfully.\n");
    } else {
      console.log("posts.json not found, skipping.\n");
    }

    console.log("=================================");
    console.log("Database import completed successfully!");
    console.log("=================================");

  } catch (error) {
    console.error("Import fatal error:", error);
  } finally {
    mongoose.disconnect();
  }
}

run();

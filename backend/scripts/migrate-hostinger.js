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

// Hostinger API URL
const HOSTINGER_API = 'https://api.zooda.in/api';

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    console.log("URI:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!\n");

    // Ensure directory exists
    const backupDir = __dirname;
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Helper for fetch JSON
    async function fetchJson(url) {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return await res.json();
    }

    // 1. Fetch and migrate Categories
    console.log("--- 1. CATEGORIES ---");
    console.log("Fetching categories from Hostinger...");
    const categories = await fetchJson(`${HOSTINGER_API}/admin/categories`);
    console.log(`Fetched ${categories.length} categories.`);
    
    fs.writeFileSync(
      path.join(backupDir, 'backup-categories.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log("Saved categories backup to backup-categories.json.");

    for (const cat of categories) {
      await Category.updateOne(
        { _id: cat._id },
        { $set: { name: cat.name, subcategories: cat.subcategories } },
        { upsert: true }
      );
    }
    console.log("Categories upserted successfully.\n");

    // 2. Fetch all businesses
    console.log("--- 2. BUSINESS LIST ---");
    console.log("Fetching all businesses from Hostinger...");
    const businesses = await fetchJson(`${HOSTINGER_API}/business/all`);
    console.log(`Fetched ${businesses.length} businesses.`);

    fs.writeFileSync(
      path.join(backupDir, 'backup-businesses.json'),
      JSON.stringify(businesses, null, 2)
    );
    console.log("Saved businesses list backup to backup-businesses.json.\n");

    // Lists to collect details for final backup files
    const allUsers = [];
    const allProducts = [];
    const allPosts = [];

    let successCount = 0;
    let failCount = 0;

    console.log("--- 3. DETAILS MIGRATION ---");
    for (let i = 0; i < businesses.length; i++) {
      const bizSummary = businesses[i];
      const bizId = bizSummary._id;
      console.log(`[${i + 1}/${businesses.length}] Migrating: ${bizSummary.businessName} (${bizId})...`);

      try {
        const detailData = await fetchJson(`${HOSTINGER_API}/businesses/${bizId}`);
        if (!detailData.success || !detailData.data) {
          console.error(`  -> Failed to get details for ${bizId}`);
          failCount++;
          continue;
        }

        const { business, products, reviews } = detailData.data;

        // a) Migrate associated User
        if (business.user) {
          const userData = business.user;
          if (userData && typeof userData === 'object' && userData._id) {
            allUsers.push(userData);

            let existingUser = await User.findById(userData._id);
            if (!existingUser) {
              const newUser = new User({
                _id: userData._id,
                firstName: userData.firstName || 'Owner',
                lastName: userData.lastName || 'Business',
                email: userData.email,
                phone: userData.phone || business.businessPhone || null,
                role: 'business_owner',
                password: 'Zooda2026!'
              });
              await newUser.save();
              console.log(`  -> Created new user: ${userData.email}`);
            } else {
              existingUser.firstName = userData.firstName || existingUser.firstName;
              existingUser.lastName = userData.lastName || existingUser.lastName;
              existingUser.email = userData.email || existingUser.email;
              existingUser.phone = userData.phone || existingUser.phone;
              existingUser.role = 'business_owner';
              await existingUser.save();
              console.log(`  -> Updated user: ${userData.email}`);
            }
          }
        }

        // b) Migrate Business
        const businessDoc = { ...business };
        if (business.user && typeof business.user === 'object') {
          businessDoc.user = business.user._id;
        }

        await Business.updateOne(
          { _id: businessDoc._id },
          { $set: businessDoc },
          { upsert: true }
        );
        console.log(`  -> Upserted business profile.`);

        // c) Migrate Products
        if (products && Array.isArray(products)) {
          for (const prod of products) {
            allProducts.push(prod);
            const prodDoc = { ...prod, business: bizId };
            await Product.updateOne(
              { _id: prod._id },
              { $set: prodDoc },
              { upsert: true }
            );
          }
          if (products.length > 0) {
            console.log(`  -> Upserted ${products.length} products.`);
          }
        }

        // d) Migrate Posts
        if (reviews && Array.isArray(reviews)) {
          for (const post of reviews) {
            const postDoc = { ...post };
            if (post.user && typeof post.user === 'object') {
              postDoc.user = post.user._id;
            }
            allPosts.push(postDoc);

            await Post.updateOne(
              { _id: post._id },
              { $set: postDoc },
              { upsert: true }
            );
          }
          if (reviews.length > 0) {
            console.log(`  -> Upserted ${reviews.length} posts.`);
          }
        }

        successCount++;
      } catch (err) {
        console.error(`  -> Error migrating business ${bizId}:`, err.message);
        failCount++;
      }

      // 100ms delay to prevent rate limits or CPU spike
      await new Promise(r => setTimeout(r, 100));
    }

    // Write final detail backups
    fs.writeFileSync(
      path.join(backupDir, 'backup-users.json'),
      JSON.stringify(allUsers, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, 'backup-products.json'),
      JSON.stringify(allProducts, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, 'backup-posts.json'),
      JSON.stringify(allPosts, null, 2)
    );

    console.log("\n=================================");
    console.log("Migration completed!");
    console.log(`Success: ${successCount} businesses`);
    console.log(`Failed: ${failCount} businesses`);
    console.log("Detailed backups written to:");
    console.log(`- ${path.join(backupDir, 'backup-categories.json')}`);
    console.log(`- ${path.join(backupDir, 'backup-businesses.json')}`);
    console.log(`- ${path.join(backupDir, 'backup-users.json')}`);
    console.log(`- ${path.join(backupDir, 'backup-products.json')}`);
    console.log(`- ${path.join(backupDir, 'backup-posts.json')}`);
    console.log("=================================");

  } catch (error) {
    console.error("Migration fatal error:", error);
  } finally {
    mongoose.disconnect();
  }
}

run();

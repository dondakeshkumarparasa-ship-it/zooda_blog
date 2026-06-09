require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { apiRouter } = require('./routes/index');
const { resetPasswordDirect } = require('./modules/auth/auth.controller');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup static uploads directory
const uploadDir = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create local uploads directory (read-only filesystem):", err.message);
}
app.use('/uploads', express.static(uploadDir));

// Setup static public/sdk directory
const sdkDir = path.join(__dirname, '../public/sdk');
try {
  if (!fs.existsSync(sdkDir)) {
    fs.mkdirSync(sdkDir, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create public/sdk directory (read-only filesystem):", err.message);
}
app.use('/sdk', express.static(sdkDir));

// Database connection middleware to ensure connection before handling routes (especially in serverless contexts)
const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err) {
      console.error("Database connection error in middleware:", err);
      return res.status(500).json({ message: "Database connection failed", error: err.message });
    }
  }
  next();
});

// Mount routes
app.use('/api', apiRouter);

// Temporary debug route to list databases
app.get('/api/debug-dbs', async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    res.json(dbs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Temporary route to trigger database imports of local backups from Vercel
app.get('/api/import-backups', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const backupDir = path.join(__dirname, '../scripts/hostinger-backups');

    const Business = require('./modules/users/business.model');
    const User = require('./modules/auth/auth.model');
    const Post = require('./modules/users/post.model');
    const Product = require('./modules/products/product.model');
    const Category = require('./modules/categories/category.model');

    const status = {
      categories: 'skipped',
      users: 'skipped',
      businesses: 'skipped',
      products: 'skipped',
      posts: 'skipped'
    };

    // 1. Categories
    const categoriesPath = path.join(backupDir, 'categories.json');
    if (fs.existsSync(categoriesPath)) {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      for (const cat of categories) {
        await Category.updateOne(
          { _id: cat._id },
          { $set: { name: cat.name, subcategories: cat.subcategories } },
          { upsert: true }
        );
      }
      status.categories = `Imported ${categories.length} categories`;
    }

    // 2. Users & Businesses
    const usersPath = path.join(backupDir, 'users.json');
    const businessesPath = path.join(backupDir, 'businesses_details.json');

    if (fs.existsSync(usersPath) && fs.existsSync(businessesPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf8'));
      
      const userIdMap = {};
      let newUsers = 0;
      let updatedUsers = 0;

      for (const userData of users) {
        const emailLower = userData.email.toLowerCase();
        let dbUser = await User.findOne({ email: emailLower });
        if (!dbUser) {
          dbUser = await User.findById(userData._id);
        }

        if (!dbUser) {
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
          newUsers++;
        } else {
          dbUser.firstName = userData.firstName || dbUser.firstName;
          dbUser.lastName = userData.lastName || dbUser.lastName;
          dbUser.role = 'business_owner';
          if (userData.phone) dbUser.phone = userData.phone;
          await dbUser.save();
          updatedUsers++;
        }
        userIdMap[userData._id] = dbUser._id;
      }
      status.users = `Created ${newUsers}, Updated ${updatedUsers} users`;

      let bizCount = 0;
      for (const biz of businesses) {
        const businessDoc = { ...biz };
        const oldUserId = biz.user && typeof biz.user === 'object' ? biz.user._id : biz.user;
        const actualUserId = userIdMap[oldUserId] || oldUserId;
        businessDoc.user = actualUserId;

        await Business.updateOne(
          { _id: businessDoc._id },
          { $set: businessDoc },
          { upsert: true }
        );
        bizCount++;
      }
      status.businesses = `Imported ${bizCount} businesses`;
    }

    // 3. Products
    const productsPath = path.join(backupDir, 'products.json');
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      let prodSuccess = 0;
      for (const prod of products) {
        const prodDoc = { ...prod };
        delete prodDoc.businessName;
        delete prodDoc.businessId;
        prodDoc.business = prod.businessId || prod.business;
        if (!prodDoc.sku) {
          prodDoc.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        }
        await Product.updateOne(
          { _id: prodDoc._id },
          { $set: prodDoc },
          { upsert: true }
        );
        prodSuccess++;
      }
      status.products = `Imported ${prodSuccess} products`;
    }

    // 4. Posts
    const postsPath = path.join(backupDir, 'posts.json');
    if (fs.existsSync(postsPath)) {
      const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
      let postSuccess = 0;
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
        postSuccess++;
      }
      status.posts = `Imported ${postSuccess} posts`;
    }

    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

// Mount non-prefixed root routes
app.post('/reset-password-direct', resetPasswordDirect);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;

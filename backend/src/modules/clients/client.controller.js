const Client = require('./client.model');
const Business = require('../users/business.model');
const Product = require('../products/product.model');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const sanitizeImageUrl = (url) => {
  if (url && typeof url === 'string' && url.startsWith('http')) {
    return url;
  }
  return "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=60";
};

const register = async (req, res) => {
  try {
    const { name, email, mobile, company, password, interests } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    let client = await Client.findOne({ $or: [{ email }, { mobile }] });
    if (client) {
      return res.status(400).json({ message: "Email or Mobile already registered" });
    }

    client = new Client({
      name,
      email,
      mobile,
      company,
      password,
      interests
    });

    await client.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: client._id,
        name: client.name,
        email: client.email,
        mobile: client.mobile,
        company: client.company,
        interests: client.interests
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await client.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: client._id }, "BANNU9", { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: client._id,
        name: client.name,
        email: client.email,
        company: client.company,
        interests: client.interests
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await Client.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ exists: false, message: "Email not found" });

    return res.json({ exists: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await Client.findById(req.user._id || req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

const syncWordpressProduct = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization denied. Missing or invalid API Key format." });
    }

    const apiKey = authHeader.replace("Bearer ", "").trim();
    if (!apiKey) {
      return res.status(401).json({ success: false, message: "Authorization denied. API Key is required." });
    }

    const business = await Business.findOne({ apiKey });
    if (!business) {
      return res.status(401).json({ success: false, message: "Authorization denied. Invalid API Key." });
    }

    const { title, description, price, status, imageUrl, category, sku } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: "Product title and price are required." });
    }

    const parsedPrice = parseFloat(price);
    const finalImageUrl = sanitizeImageUrl(imageUrl);
    const finalSku = sku ? `WP-${business._id}-${sku}` : `WP-${business._id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let product = null;
    if (sku) {
      product = await Product.findOne({ business: business._id, sku: `WP-${business._id}-${sku}` });
    }
    if (!product) {
      product = await Product.findOne({ business: business._id, name: title });
    }

    if (product) {
      product.price = isNaN(parsedPrice) ? 0 : parsedPrice;
      product.description = description || product.description;
      product.image = { url: finalImageUrl || product.image?.url, alt: title };
      product.tags = category ? [category] : product.tags;
      product.sku = finalSku;
      await product.save();
    } else {
      product = await Product.create({
        user: business.user,
        business: business._id,
        name: title,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        description: description || "WooCommerce synced product.",
        image: { url: finalImageUrl, alt: title },
        tags: category ? [category] : ["WooCommerce"],
        sku: finalSku,
        productLink: null
      });
    }

    const productCount = await Product.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalProducts: productCount });

    res.status(200).json({
      success: true,
      message: "Product synced successfully",
      product
    });
  } catch (err) {
    console.error("WordPress product sync error:", err);
    res.status(500).json({ success: false, message: "Server error during WooCommerce sync" });
  }
};

const syncWordpressProductsBulk = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization denied. Missing or invalid API Key format." });
    }

    const apiKey = authHeader.replace("Bearer ", "").trim();
    const business = await Business.findOne({ apiKey });
    if (!business) {
      return res.status(401).json({ success: false, message: "Authorization denied. Invalid API Key." });
    }

    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ success: false, message: "Invalid payload format. Expected products array." });
    }

    let syncedCount = 0;
    for (const p of products) {
      const { title, description, price, status, imageUrl, category, sku } = p;
      if (!title) continue;

      const parsedPrice = parseFloat(price || 0);
      const finalImageUrl = sanitizeImageUrl(imageUrl);
      const finalSku = sku ? `WP-${business._id}-${sku}` : `WP-${business._id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      let product = null;
      if (sku) {
        product = await Product.findOne({ business: business._id, sku: `WP-${business._id}-${sku}` });
      }
      if (!product) {
        product = await Product.findOne({ business: business._id, name: title });
      }

      if (product) {
        product.price = isNaN(parsedPrice) ? 0 : parsedPrice;
        product.description = description || product.description;
        product.image = { url: finalImageUrl || product.image?.url, alt: title };
        product.tags = category ? [category] : product.tags;
        product.sku = finalSku;
        await product.save();
      } else {
        await Product.create({
          user: business.user,
          business: business._id,
          name: title,
          price: isNaN(parsedPrice) ? 0 : parsedPrice,
          description: description || "WooCommerce synced product.",
          image: { url: finalImageUrl, alt: title },
          tags: category ? [category] : ["WooCommerce"],
          sku: finalSku,
          productLink: null
        });
      }
      syncedCount++;
    }

    const productCount = await Product.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalProducts: productCount });

    res.json({ success: true, message: `Sync completed! Bulk synced ${syncedCount} products.`, count: syncedCount });
  } catch (err) {
    console.error("Bulk sync error:", err);
    res.status(500).json({ success: false, message: "Server error during WooCommerce bulk sync" });
  }
};

const syncWoocommercePull = async (req, res) => {
  try {
    const { businessId, storeUrl, consumerKey, consumerSecret } = req.body;
    if (!businessId || !storeUrl || !consumerKey || !consumerSecret) {
      return res.status(400).json({ success: false, message: "Missing required WooCommerce connection credentials." });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    business.wooStoreUrl = storeUrl;
    business.wooConsumerKey = consumerKey;
    business.wooConsumerSecret = consumerSecret;
    await business.save();

    let cleanUrl = storeUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    cleanUrl = cleanUrl.replace(/\/$/, "");

    console.log(`Connecting directly to WooCommerce REST API: ${cleanUrl}`);

    const response = await axios.get(`${cleanUrl}/wp-json/wc/v3/products`, {
      params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        per_page: 100
      },
      timeout: 30000
    });

    if (!Array.isArray(response.data)) {
      return res.status(400).json({ success: false, message: "Invalid product payload received from WooCommerce store." });
    }

    const woocommerceProducts = response.data;
    let syncedCount = 0;

    for (const p of woocommerceProducts) {
      const title = p.name;
      const description = p.description || p.short_description || "";
      const price = parseFloat(p.price || 0);
      const imageUrl = p.images && p.images.length > 0 ? sanitizeImageUrl(p.images[0].src) : "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=60";
      const category = p.categories && p.categories.length > 0 ? p.categories[0].name : "WooCommerce";
      const sku = p.sku ? `WP-${business._id}-${p.sku}` : `WP-${business._id}-${p.id}`;

      let product = await Product.findOne({ business: business._id, sku: sku });
      if (!product) {
        product = await Product.findOne({ business: business._id, name: title });
      }

      if (product) {
        product.price = price;
        product.description = description;
        product.image = { url: imageUrl || product.image?.url, alt: title };
        product.tags = [category];
        product.sku = sku;
        await product.save();
      } else {
        await Product.create({
          user: business.user,
          business: business._id,
          name: title,
          price: price,
          description: description || "WooCommerce synced product.",
          image: { url: imageUrl, alt: title },
          tags: [category],
          sku: sku,
          productLink: null
        });
      }
      syncedCount++;
    }

    const productCount = await Product.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalProducts: productCount });

    res.json({ success: true, message: `Sync completed! Pulled and synced ${syncedCount} products from WooCommerce.`, count: syncedCount });
  } catch (err) {
    console.error("WooCommerce pull sync error:", err);
    res.status(500).json({ success: false, message: "Server error during WooCommerce pull sync" });
  }
};

const syncShopifyPull = async (req, res) => {
  try {
    const { businessId, storeUrl } = req.body;
    if (!businessId || !storeUrl) {
      return res.status(400).json({ success: false, message: "Missing required Shopify store URL." });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    let cleanUrl = storeUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    cleanUrl = cleanUrl.replace(/\/$/, "");

    console.log(`Connecting directly to Shopify public catalog: ${cleanUrl}`);

    const response = await axios.get(`${cleanUrl}/products.json`, {
      params: { limit: 250 },
      timeout: 25000
    });

    if (!response.data || !Array.isArray(response.data.products)) {
      return res.status(400).json({ success: false, message: "Invalid product payload received from Shopify store." });
    }

    const shopifyProducts = response.data.products;
    let syncedCount = 0;

    for (const p of shopifyProducts) {
      const title = p.title;
      const description = p.body_html || "";
      const price = p.variants && p.variants.length > 0 ? parseFloat(p.variants[0].price || 0) : 0;
      const imageUrl = p.images && p.images.length > 0 ? sanitizeImageUrl(p.images[0].src) : "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=60";
      const category = p.product_type || "Shopify";
      const sku = p.variants && p.variants[0] && p.variants[0].sku ? `SPY-${business._id}-${p.variants[0].sku}` : `SPY-${business._id}-${p.id}`;

      let product = await Product.findOne({ business: business._id, sku: sku });
      if (!product) {
        product = await Product.findOne({ business: business._id, name: title });
      }

      if (product) {
        product.price = price;
        product.description = description;
        product.image = { url: imageUrl || product.image?.url, alt: title };
        product.tags = [category];
        product.sku = sku;
        await product.save();
      } else {
        await Product.create({
          user: business.user,
          business: business._id,
          name: title,
          price: price,
          description: description || "Shopify synced product.",
          image: { url: imageUrl, alt: title },
          tags: [category],
          sku: sku,
          productLink: null
        });
      }
      syncedCount++;
    }

    const productCount = await Product.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalProducts: productCount });

    res.json({ success: true, message: `Sync completed! Pulled and synced ${syncedCount} products from Shopify store.`, count: syncedCount });
  } catch (err) {
    console.error("Shopify pull sync error:", err);
    res.status(500).json({ success: false, message: "Server error during Shopify pull sync. Make sure the domain is correct and public." });
  }
};

const syncCustomProduct = async (req, res) => {
  try {
    let apiKey = req.body.apiKey;
    const authHeader = req.header("Authorization");
    if (!apiKey && authHeader && authHeader.startsWith("Bearer ")) {
      apiKey = authHeader.replace("Bearer ", "").trim();
    }

    if (!apiKey) {
      return res.status(401).json({ success: false, message: "Authorization denied. Connection API Key is required." });
    }

    const business = await Business.findOne({ apiKey });
    if (!business) {
      return res.status(401).json({ success: false, message: "Authorization denied. Invalid API Key." });
    }

    const { title, name, description, price, imageUrl, image, category, sku, productLink } = req.body;
    const finalName = title || name;
    if (!finalName || price === undefined) {
      return res.status(400).json({ success: false, message: "Product name and price are required." });
    }

    const parsedPrice = parseFloat(price);
    const rawImageUrl = imageUrl || (image && image.url);
    const finalImageUrl = sanitizeImageUrl(rawImageUrl);
    const sourceCategory = category || "Custom SDK";
    const prefix = sourceCategory.toLowerCase().includes("shopify") ? "SPY" : "SDK";
    const finalSku = sku ? `${prefix}-${business._id}-${sku}` : `${prefix}-${business._id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let product = null;
    if (sku) {
      product = await Product.findOne({ business: business._id, sku: `${prefix}-${business._id}-${sku}` });
    }
    if (!product) {
      product = await Product.findOne({ business: business._id, name: finalName });
    }

    if (product) {
      product.price = isNaN(parsedPrice) ? 0 : parsedPrice;
      product.description = description || product.description;
      product.image = { url: finalImageUrl || product.image?.url, alt: finalName };
      product.tags = sourceCategory ? [sourceCategory] : product.tags;
      product.sku = finalSku;
      if (productLink) product.productLink = productLink;
      await product.save();
    } else {
      product = await Product.create({
        user: business.user,
        business: business._id,
        name: finalName,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        description: description || "Synced custom product.",
        image: { url: finalImageUrl, alt: finalName },
        tags: sourceCategory ? [sourceCategory] : ["Custom SDK"],
        sku: finalSku,
        productLink: productLink || null
      });
    }

    const productCount = await Product.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalProducts: productCount });

    res.status(200).json({
      success: true,
      message: "Product synced successfully",
      product
    });
  } catch (err) {
    console.error("Custom product sync error:", err);
    res.status(500).json({ success: false, message: "Server error during product sync" });
  }
};

const deleteSyncedProduct = async (req, res) => {
  try {
    let apiKey = req.body.apiKey;
    const authHeader = req.header("Authorization");
    if (!apiKey && authHeader && authHeader.startsWith("Bearer ")) {
      apiKey = authHeader.replace("Bearer ", "").trim();
    }

    if (!apiKey) {
      return res.status(401).json({ success: false, message: "Authorization denied. API Key is required." });
    }

    const business = await Business.findOne({ apiKey });
    if (!business) {
      return res.status(401).json({ success: false, message: "Authorization denied. Invalid API Key." });
    }

    const { sku, title } = req.body;
    if (!sku && !title) {
      return res.status(400).json({ success: false, message: "SKU or Product title is required to delete." });
    }

    let product = null;
    if (sku) {
      product = await Product.findOne({
        business: business._id,
        $or: [
          { sku: sku },
          { sku: `WP-${business._id}-${sku}` },
          { sku: `SPY-${business._id}-${sku}` },
          { sku: `SDK-${business._id}-${sku}` }
        ]
      });
    }
    if (!product && title) {
      product = await Product.findOne({ business: business._id, name: title });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    await Product.findByIdAndDelete(product._id);

    const productCount = await Product.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalProducts: productCount });

    res.json({ success: true, message: "Product deleted successfully from hub." });
  } catch (err) {
    console.error("Delete synced product error:", err);
    res.status(500).json({ success: false, message: "Server error deleting synced product." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await Client.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Client password reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  checkEmail,
  getProfile,
  syncWordpressProduct,
  syncWordpressProductsBulk,
  syncWoocommercePull,
  resetPassword
};

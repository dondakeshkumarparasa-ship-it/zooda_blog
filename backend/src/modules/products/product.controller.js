const Product = require('./product.model');
const Business = require('../users/business.model');

const createProduct = async (req, res) => {
  try {
    const { name, productLink, price, tags } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Product name and price are required" });
    }

    const business = await Business.findOne({ user: req.user._id || req.user.id });
    if (!business) {
      return res.status(400).json({ message: "No business found for this user" });
    }

    console.log("File received:", req.file);

    let image = null;
    if (req.file) {
      image = {
        url: req.file.path || `/uploads/${req.file.filename}`,
        alt: name,
      };
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Invalid price format" });
    }

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) parsedTags = [];
      } catch {
        parsedTags = [];
      }
    }

    const product = await Product.create({
      user: req.user._id || req.user.id,
      business: business._id,
      name,
      productLink: productLink || null,
      price: parsedPrice,
      image,
      tags: parsedTags,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("user", "firstName lastName email")
      .populate("business", "businessName businessCategory");

    const productCount = await Product.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalProducts: productCount });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const getProductByBusiness = async (req, res) => {
  try {
    const products = await Product.find({
      $or: [
        { business: req.params.businessId },
        { businessId: req.params.businessId }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = {
        url: req.file.path || `/uploads/${req.file.filename}`,
        filename: req.file.filename
      };
    }
    
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    if (updateData.tags && typeof updateData.tags === 'string') {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch (e) {
        // ignore
      }
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const productCount = await Product.countDocuments({ business: updatedProduct.business });
    await Business.findByIdAndUpdate(updatedProduct.business, { totalProducts: productCount });
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const productCount = await Product.countDocuments({ business: product.business });
    await Business.findByIdAndUpdate(product.business, { totalProducts: productCount });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};

module.exports = {
  createProduct,
  getProductByBusiness,
  updateProduct,
  deleteProduct
};

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, X, Edit, Briefcase, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ==================== Type Definitions ====================
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Business {
  _id: string;
  businessName: string;
  user: User | string;
}

interface Product {
  _id: string;
  name: string;
  productLink?: string;
  price: number;
  tags: string[];
  image?: { url: string };
  isActive: boolean;
  sku?: string;
}

interface ProductsScreenProps {
  business: Business | null | undefined; // undefined = loading, null = no business
  currentUser: User | null;
  notify: (type: string, message: string) => void;
  businessError?: string | null;
  onRetryBusiness?: () => void;
}

// ==================== Product Create Form Modal ====================
const ProductCreateForm = ({ 
  businessId, 
  onClose, 
  onSuccess, 
  notify, 
  existingProduct 
}: { 
  businessId: string;
  onClose: () => void;
  onSuccess: () => void;
  notify: (type: string, message: string) => void;
  existingProduct?: Product | null;
}) => {
  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    productLink: existingProduct?.productLink || '',
    price: existingProduct?.price?.toString() || '',
    tags: existingProduct?.tags || [],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prodLoading, setProdLoading] = useState(false);

  const handleAddTag = () => {
    if (!currentTag.trim()) return;
    if (formData.tags.includes(currentTag.trim())) return;

    setFormData({
      ...formData,
      tags: [...formData.tags, currentTag.trim()],
    });
    setCurrentTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t: string) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdLoading(true);

    const data = new FormData();
    data.append('businessId', businessId);
    data.append('name', formData.name);
    data.append('productLink', formData.productLink || '');
    data.append('price', formData.price);
    data.append('tags', JSON.stringify(formData.tags));

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (existingProduct) {
        await axios.put(`/products/${existingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notify('success', 'Product updated successfully.');
      } else {
        await axios.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notify('success', 'Product created successfully.');
      }
      onSuccess();
    } catch (err: any) {
      notify('error', err.response?.data?.message || `Failed to ${existingProduct ? 'update' : 'create'} product.`);
    } finally {
      setProdLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">
            {existingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Link</label>
            <input
              type="text"
              placeholder="https://example.com/product"
              value={formData.productLink}
              onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              required
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className="input-field flex-1"
              />
              <button type="button" onClick={handleAddTag} className="btn-secondary px-4">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-secondary rounded-full text-sm flex items-center gap-2 text-secondary-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Image {!existingProduct && <span className="text-destructive">*</span>}
            </label>
            <p className="text-xs text-muted-foreground mb-2">Recommended: 300×300px</p>
            <input
              type="file"
              required={!existingProduct}
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20"
            />
            {existingProduct?.image?.url && !imageFile && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Current Image:</p>
                <img
                  src={existingProduct.image.url}
                  alt="Current product"
                  className="w-24 h-24 object-cover rounded-xl border border-border"
                />
              </div>
            )}
          </div>

          <button type="submit" disabled={prodLoading} className="btn-primary w-full">
            {prodLoading ? 'Saving...' : existingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ==================== Product Card ====================
const ProductCard = ({ product, onDelete, onEdit, isOwner }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl border border-border overflow-hidden card-hover group"
  >
    <div className="relative">
      <img
        src={product.image?.url || '/uploads/default.png'}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e: any) => {
          e.target.src = 'https://placehold.co/400x300/1a1a2e/ffffff?text=No+Image';
        }}
      />
      {isOwner && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-info text-white rounded-full hover:bg-info/80 transition-colors"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 bg-destructive text-white rounded-full hover:bg-destructive/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <span
        className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
          product.isActive ? 'bg-success/90 text-white' : 'bg-destructive/90 text-white'
        }`}
      >
        {product.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>

    <div className="p-5">
      <h3 className="text-lg font-semibold text-foreground truncate mb-2">{product.name}</h3>
      <p className="text-2xl font-bold text-primary mb-3">₹{(product.price || 0).toFixed(2)}</p>

      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
              {tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
              +{product.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        SKU: {product.sku || 'N/A'}
      </div>
    </div>
  </motion.div>
);

// ==================== Main Products Screen ====================
const ProductsScreen = ({ business, currentUser, notify, businessError, onRetryBusiness }: ProductsScreenProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const businessId = business?._id;
  const businessUserId = typeof business?.user === 'object' ? business.user._id : business?.user;
  const isOwner = !!(currentUser && businessUserId && currentUser._id === businessUserId);

  const fetchProducts = useCallback(async () => {
    if (!businessId) return;
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await axios.get(`/product/${businessId}`);
      setProducts(res.data.products || []);
    } catch (error) {
      setProductsError('Failed to load products. Please try again.');
      notify('error', 'Failed to fetch products.');
    } finally {
      setProductsLoading(false);
    }
  }, [businessId, notify]);

  useEffect(() => {
    if (businessId) fetchProducts();
  }, [businessId, fetchProducts]);

  const handleProductCreated = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/product/${productId}`);
      notify('success', 'Product deleted successfully.');
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      notify('error', 'Failed to delete product.');
    }
  };

  // ========== Business states ==========
  if (business === undefined) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
          <div className="bg-gradient-to-r from-warning/50 to-warning/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/30" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-white/30 rounded" />
                <div className="h-4 w-24 bg-white/30 rounded" />
              </div>
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-5 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (businessError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto"
      >
        <AlertCircle size={60} className="text-destructive mb-6" />
        <h2 className="text-2xl font-bold mb-3">Oops! Something went wrong</h2>
        <p className="text-muted-foreground mb-8">{businessError}</p>
        {onRetryBusiness && (
          <button
            onClick={onRetryBusiness}
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        )}
      </motion.div>
    );
  }

  if (!business) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <Briefcase size={60} className="text-muted-foreground mb-6" aria-hidden="true" />
        <h2 className="text-2xl font-bold mb-3">No Business Registered</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Register your business to add and manage products.
        </p>
        <Link
          to="/create-business"
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          <Plus size={18} aria-hidden="true" />
          Add Business
        </Link>
      </motion.div>
    );
  }

  // Business exists
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-xl">
            <ShoppingBag className="text-warning" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Catalog</h1>
            <p className="text-muted-foreground text-sm">Manage your product listings</p>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductFormOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>
        )}
      </div>

      {/* Products loading/error */}
      {productsLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading products..." />
        </div>
      )}

      {productsError && !productsLoading && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-destructive mb-4" size={40} />
          <p className="text-muted-foreground mb-4">{productsError}</p>
          <button onClick={fetchProducts} className="btn-primary">
            Try Again
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!productsLoading && !productsError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isOwner={isOwner}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-card rounded-2xl border border-border">
              <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-6">
                {isOwner 
                  ? "Add your first product to get started"
                  : "This business hasn't added any products yet."}
              </p>
              {isOwner && (
                <button
                  onClick={() => setIsProductFormOpen(true)}
                  className="btn-primary"
                >
                  Add Product
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {isProductFormOpen && businessId && (
          <ProductCreateForm
            businessId={businessId}
            onClose={() => {
              setIsProductFormOpen(false);
              setEditingProduct(null);
            }}
            onSuccess={handleProductCreated}
            notify={notify}
            existingProduct={editingProduct}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsScreen;
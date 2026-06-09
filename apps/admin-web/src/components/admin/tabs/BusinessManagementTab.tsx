import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Trash2, Edit, Save, X, Mail, Phone, Tag, MapPin, Globe, Newspaper, ShoppingBag, Percent, Store, Heart, MessageCircle, Calendar } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { EmptyState } from '../EmptyState';
import { LoadingSpinner } from '../LoadingSpinner';

interface Business {
  _id: string;
  businessName: string;
  businessCategory: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessDescription: string;
  businessWebsite?: string;
  status: string;
  totalPosts?: number;
  totalProducts?: number;
  totalPromotions?: number;
}

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  status: string;
  mediaUrl?: string;
  mediaType?: string;
  platforms?: string[];
  category?: string;
  caption?: string;
  scheduledFor?: string | null;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  isActive: boolean;
}

interface Promotion {
  _id: string;
  name: string;
  description: string;
  discountValue: number;
  startDate: string;
  endDate?: string;
  type: string;
  status: string;
}

interface BusinessManagementTabProps {
  businesses: Business[];
  onDeleteBusiness: (id: string) => void;
  onDeletePost: (businessId: string, postId: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteProduct: (businessId: string, productId: string) => Promise<{ success: boolean; error?: string }>;
  onDeletePromotion: (businessId: string, promotionId: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateBusiness: (id: string, data: Partial<Business>) => void;
  fetchBusinessPosts: (id: string) => Promise<Post[]>;
  fetchBusinessProducts: (id: string) => Promise<Product[]>;
  fetchBusinessPromotions: (id: string) => Promise<Promotion[]>;
}

export function BusinessManagementTab({
  businesses,
  onDeleteBusiness,
  onDeletePost,
  onDeleteProduct,
  onDeletePromotion,
  onUpdateBusiness,
  fetchBusinessPosts,
  fetchBusinessProducts,
  fetchBusinessPromotions,
}: BusinessManagementTabProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeSection, setActiveSection] = useState<'details' | 'posts' | 'products' | 'promotions'>('details');
  const [editingBusiness, setEditingBusiness] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Business>>({});
  const [businessData, setBusinessData] = useState<{ posts: Post[]; products: Product[]; promotions: Promotion[] }>({
    posts: [],
    products: [],
    promotions: [],
  });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (selectedBusiness && activeSection !== 'details') {
      loadBusinessData();
    }
  }, [selectedBusiness, activeSection]);

  const loadBusinessData = async () => {
    if (!selectedBusiness) return;
    setLoadingData(true);
    try {
      if (activeSection === 'posts') {
        const posts = await fetchBusinessPosts(selectedBusiness._id);
        setBusinessData(prev => ({ ...prev, posts: posts || [] }));
      } else if (activeSection === 'products') {
        const products = await fetchBusinessProducts(selectedBusiness._id);
        setBusinessData(prev => ({ ...prev, products: products || [] }));
      } else if (activeSection === 'promotions') {
        const promotions = await fetchBusinessPromotions(selectedBusiness._id);
        setBusinessData(prev => ({ ...prev, promotions: promotions || [] }));
      }
    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business._id);
    setEditForm({
      businessName: business.businessName,
      businessCategory: business.businessCategory,
      businessEmail: business.businessEmail,
      businessPhone: business.businessPhone,
      businessAddress: business.businessAddress,
      businessDescription: business.businessDescription,
      businessWebsite: business.businessWebsite || '',
    });
  };

  const handleSaveBusiness = async (businessId: string) => {
    await onUpdateBusiness(businessId, editForm);
    setEditingBusiness(null);
    setEditForm({});
  };

  const handleDeletePost = async (businessId: string, postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await onDeletePost(businessId, postId);
      if (result.success) {
        // Refresh posts after deletion
        const posts = await fetchBusinessPosts(businessId);
        setBusinessData(prev => ({ ...prev, posts }));
      }
    }
  };

  const handleDeleteProduct = async (businessId: string, productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await onDeleteProduct(businessId, productId);
      if (result.success) {
        // Refresh products after deletion
        const products = await fetchBusinessProducts(businessId);
        setBusinessData(prev => ({ ...prev, products }));
      }
    }
  };

  const handleDeletePromotion = async (businessId: string, promotionId: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      const result = await onDeletePromotion(businessId, promotionId);
      if (result.success) {
        // Refresh promotions after deletion
        const promotions = await fetchBusinessPromotions(businessId);
        setBusinessData(prev => ({ ...prev, promotions }));
      }
    }
  };

  if (selectedBusiness) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedBusiness(null);
                setBusinessData({ posts: [], products: [], promotions: [] });
              }}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{selectedBusiness.businessName}</h2>
              <StatusBadge status={selectedBusiness.status} />
            </div>
          </div>
        </div>

        <div className="flex rounded-lg bg-muted p-1 overflow-x-auto">
          {(['details'] as const).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === section
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {section === 'details' ? 'Business Details' :
               section === 'posts' ? `Posts (${businessData.posts.length})` :
               section === 'products' ? `Products (${businessData.products.length})` :
               `Promotions (${businessData.promotions.length})`}
            </button>
          ))}
        </div>

        {activeSection === 'details' && (
          <BusinessDetailsSection
            business={selectedBusiness}
            editingBusiness={editingBusiness}
            editForm={editForm}
            setEditForm={setEditForm}
            onEditBusiness={handleEditBusiness}
            onSaveBusiness={handleSaveBusiness}
            onCancelEdit={() => { setEditingBusiness(null); setEditForm({}); }}
            onDeleteBusiness={onDeleteBusiness}
          />
        )}

      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-foreground">All Businesses</h2>
        <p className="text-sm text-muted-foreground">Manage and view all business accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map(business => (
          <div key={business._id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground">{business.businessName}</h3>
                <StatusBadge status={business.status} />
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p className="flex items-center gap-2"><Tag className="h-4 w-4" />{business.businessCategory}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{business.businessEmail}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{business.businessPhone}</p>
              </div>

              <div className="flex gap-4 py-3 border-t border-border mb-4">
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-foreground">{business.totalPosts || 0}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-foreground">{business.totalProducts || 0}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-foreground">{business.totalPromotions || 0}</p>
                  <p className="text-xs text-muted-foreground">Promotions</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBusiness(business)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${business.businessName}? This will also delete all posts, products, and promotions.`)) {
                      onDeleteBusiness(business._id);
                    }
                  }}
                  className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BusinessDetailsSection({
  business,
  editingBusiness,
  editForm,
  setEditForm,
  onEditBusiness,
  onSaveBusiness,
  onCancelEdit,
  onDeleteBusiness,
}: {
  business: Business;
  editingBusiness: string | null;
  editForm: Partial<Business>;
  setEditForm: (form: Partial<Business>) => void;
  onEditBusiness: (business: Business) => void;
  onSaveBusiness: (id: string) => void;
  onCancelEdit: () => void;
  onDeleteBusiness: (id: string) => void;
}) {
  const isEditing = editingBusiness === business._id;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Business Information</h3>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => onSaveBusiness(business._id)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-success-foreground font-medium text-sm hover:bg-success/90 transition-all">
                <Save className="h-4 w-4" /> Save
              </button>
              <button onClick={onCancelEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-all">
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => onEditBusiness(business)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-all">
              <Edit className="h-4 w-4" /> Edit Business
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Business Name" icon={Store} value={isEditing ? editForm.businessName : business.businessName} editing={isEditing} onChange={(v) => setEditForm({ ...editForm, businessName: v })} />
          <FormField label="Category" icon={Tag} value={isEditing ? editForm.businessCategory : business.businessCategory} editing={isEditing} onChange={(v) => setEditForm({ ...editForm, businessCategory: v })} />
          <FormField label="Email" icon={Mail} value={isEditing ? editForm.businessEmail : business.businessEmail} editing={isEditing} onChange={(v) => setEditForm({ ...editForm, businessEmail: v })} type="email" />
          <FormField label="Phone" icon={Phone} value={isEditing ? editForm.businessPhone : business.businessPhone} editing={isEditing} onChange={(v) => setEditForm({ ...editForm, businessPhone: v })} />
          <FormField label="Website" icon={Globe} value={isEditing ? editForm.businessWebsite : business.businessWebsite} editing={isEditing} onChange={(v) => setEditForm({ ...editForm, businessWebsite: v })} placeholder="https://example.com" />
          <FormField label="Address" icon={MapPin} value={isEditing ? editForm.businessAddress : business.businessAddress} editing={isEditing} onChange={(v) => setEditForm({ ...editForm, businessAddress: v })} textarea />
          <div className="md:col-span-2">
            <FormField label="Description" value={isEditing ? editForm.businessDescription : business.businessDescription} editing={isEditing} onChange={(v) => setEditForm({ ...editForm, businessDescription: v })} textarea />
          </div>
        </div>
      </div>

      <div className="bg-destructive/5 rounded-xl border border-destructive/20 p-6">
        <h4 className="font-semibold text-destructive mb-2">Danger Zone</h4>
        <p className="text-sm text-muted-foreground mb-4">Permanently delete this business and all its data</p>
        <button
          onClick={() => {
            if (window.confirm(`Delete ${business.businessName}? This action cannot be undone.`)) {
              onDeleteBusiness(business._id);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:bg-destructive/90 transition-all"
        >
          <Trash2 className="h-4 w-4" /> Delete Business
        </button>
      </div>
    </div>
  );
}

function FormField({ label, icon: Icon, value, editing, onChange, type = 'text', placeholder, textarea }: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value?: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">{label}</label>
      {editing ? (
        textarea ? (
          <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        ) : (
          <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        )
      ) : (
        <p className="flex items-center gap-2 text-foreground">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {value || 'Not provided'}
        </p>
      )}
    </div>
  );
}


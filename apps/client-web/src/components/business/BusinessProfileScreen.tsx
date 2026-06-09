import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Globe,
  Phone,
  MapPin,
  Building,
  FileText,
  Plus,
  AlertCircle,
  RefreshCw,
  Pencil,
  X,
  Save,
  Upload,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";   // ✅ use the configured api instance

interface Business {
  _id: string;
  businessName: string;
  businessCategory: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessWebsite?: string;
  logoUrl?: string;
}

const BusinessProfileScreen: React.FC = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Business>>({});
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [removeCurrentLogo, setRemoveCurrentLogo] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<string[]>([]);

  // Categories loading
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const res = await api.get("/admin/categories");
        const cats = res.data.categories || res.data;
        setCategories(Array.isArray(cats) ? cats.map(c => typeof c === 'string' ? c : c.name) : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategoriesError("Could not load categories. Please try again.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchBusiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/business/me");
      if (res.data?.business) {
        setBusiness(res.data.business);
      } else {
        setBusiness(null);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setBusiness(null);
      } else {
        setError("Failed to load business profile. Please try again.");
        console.error("Error fetching business:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  useEffect(() => {
    if (business) {
      setEditFormData({
        businessName: business.businessName,
        businessCategory: business.businessCategory,
        businessDescription: business.businessDescription || "",
        businessAddress: business.businessAddress || "",
        businessPhone: business.businessPhone || "",
        businessWebsite: business.businessWebsite || "",
      });
      setRemoveCurrentLogo(false);
      setEditLogo(null);
    }
  }, [business]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditLogo(e.target.files[0]);
      setRemoveCurrentLogo(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setEditLoading(true);
    setEditError(null);
    setEditErrors([]);

    try {
      const data = new FormData();
      Object.entries(editFormData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value);
        }
      });

      if (editLogo) {
        data.append("media", editLogo);
      } else if (removeCurrentLogo) {
        data.append("removeLogo", "true");
      }

      const res = await api.put(`/business/${business._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        await fetchBusiness();
        setIsEditing(false);
        setEditLogo(null);
        setRemoveCurrentLogo(false);
      } else {
        if (res.data.errors && Array.isArray(res.data.errors)) {
          setEditErrors(res.data.errors);
        } else {
          setEditError(res.data.message || "Failed to update business");
        }
      }
    } catch (err: any) {
      const responseData = err.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        setEditErrors(responseData.errors);
      } else {
        setEditError(responseData?.message || "Failed to update business");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
    setEditErrors([]);
    setEditLogo(null);
    setRemoveCurrentLogo(false);
    if (business) {
      setEditFormData({
        businessName: business.businessName,
        businessCategory: business.businessCategory,
        businessDescription: business.businessDescription || "",
        businessAddress: business.businessAddress || "",
        businessPhone: business.businessPhone || "",
        businessWebsite: business.businessWebsite || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
          <div className="bg-gradient-to-r from-primary/50 to-info/50 p-6">
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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto"
      >
        <AlertCircle size={60} className="text-destructive mb-6" />
        <h2 className="text-2xl font-bold mb-3">Oops! Something went wrong</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <button
          onClick={fetchBusiness}
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
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
          Register your business to show your profile, products and promotions.
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

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Edit Business</h2>
            <button
              onClick={handleCancelEdit}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {editErrors.length > 0 && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              <ul className="list-disc pl-5">
                {editErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          {editError && !editErrors.length && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {editError}
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Business Name</label>
              <input
                name="businessName"
                required
                value={editFormData.businessName || ""}
                onChange={handleEditChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              {categoriesLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading categories...</span>
                </div>
              ) : categoriesError ? (
                <div className="flex items-center gap-2 text-destructive mt-1">
                  <AlertCircle size={16} />
                  <span className="text-sm">{categoriesError}</span>
                </div>
              ) : (
                <select
                  name="businessCategory"
                  required
                  value={editFormData.businessCategory || ""}
                  onChange={handleEditChange}
                  className="input w-full"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="businessDescription"
                rows={4}
                value={editFormData.businessDescription || ""}
                onChange={handleEditChange}
                className="input w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Globe size={16} />
              <input
                name="businessWebsite"
                value={editFormData.businessWebsite || ""}
                onChange={handleEditChange}
                className="input w-full"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} />
              <input
                name="businessPhone"
                required
                value={editFormData.businessPhone || ""}
                onChange={handleEditChange}
                className="input w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <input
                name="businessAddress"
                required
                value={editFormData.businessAddress || ""}
                onChange={handleEditChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Upload size={16} />
                Business Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditFileChange}
              />
              {business.logoUrl && !editLogo && (
                <p className="text-xs text-muted-foreground mt-1">
                  Current logo will be kept if no new file is selected.
                </p>
              )}
              {business.logoUrl && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="removeLogo"
                    checked={removeCurrentLogo}
                    onChange={(e) => setRemoveCurrentLogo(e.target.checked)}
                    disabled={!!editLogo}
                  />
                  <label htmlFor="removeLogo" className="text-sm text-muted-foreground">
                    Remove current logo (no new logo will be uploaded)
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={editLoading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
              >
                {editLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={editLoading}
                className="btn-secondary flex-1 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-card rounded-2xl border border-border overflow-hidden relative">
        <div className="bg-gradient-to-r from-primary to-info p-6">
          <div className="flex items-center gap-4">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.businessName} logo`}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                <Building size={32} className="text-white" aria-hidden="true" />
              </div>
            )}
            <div className="text-white">
              <h1 className="text-2xl font-bold">{business.businessName}</h1>
              <p className="text-white/80 capitalize">{business.businessCategory}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Edit business"
          >
            <Pencil size={18} className="text-white" />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <InfoItem
            icon={<FileText size={14} aria-hidden="true" />}
            label="Description"
            value={business.businessDescription || "No description"}
          />
          <InfoItem
            icon={<MapPin size={14} aria-hidden="true" />}
            label="Address"
            value={business.businessAddress || "No address"}
          />
          <InfoItem
            icon={<Phone size={14} aria-hidden="true" />}
            label="Phone"
            value={business.businessPhone || "No phone"}
          />
          {business.businessWebsite && (
            <InfoItem
              icon={<Globe size={14} aria-hidden="true" />}
              label="Website"
              value={
                <a
                  href={business.businessWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {business.businessWebsite}
                </a>
              }
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div>
    <label className="text-sm text-muted-foreground flex items-center gap-2">
      {icon}
      {label}
    </label>
    <div className="mt-1 text-foreground">{value}</div>
  </div>
);

export default BusinessProfileScreen;
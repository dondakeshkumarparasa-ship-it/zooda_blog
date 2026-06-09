import React, { useState, useEffect } from "react";
import axios from "@/lib/api";
import { motion } from "framer-motion";
import { Building2, Upload, Phone, Globe, MapPin, Loader2, AlertCircle } from "lucide-react";

const CreateBusinessForm = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessCategory: "",
    businessDescription: "",
    businessWebsite: "",
    businessAddress: "",
    businessPhone: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // New state for categories
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        // Adjust the endpoint to match your API
        const res = await axios.get("/admin/categories");
        // Assuming the response is an array of category strings or objects with a name property
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (logo) {
        data.append("media", logo);
      }

      const res = await axios.post("/business", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setMessage("Business created successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to create business";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto py-16 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">

        <div className="flex items-center gap-3 mb-6">
          <Building2 className="text-primary" size={26} />
          <h1 className="text-2xl font-bold">Create Your Business</h1>
        </div>

        {message && (
          <div className="mb-4 text-sm text-center text-red-500">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Business Name */}
          <div>
            <label className="text-sm font-medium">Business Name</label>
            <input
              name="businessName"
              required
              className="input w-full"
              placeholder="Enter business name"
              onChange={handleChange}
            />
          </div>

          {/* Category Dropdown */}
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
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-xs underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <select
                name="businessCategory"
                required
                className="input w-full"
                value={formData.businessCategory}
                onChange={handleChange}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="businessDescription"
              required
              className="input w-full"
              rows={4}
              placeholder="Describe your business..."
              onChange={handleChange}
            />
          </div>

          {/* Website */}
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <input
              name="businessWebsite"
              className="input w-full"
              placeholder="https://yourwebsite.com"
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <input
              name="businessPhone"
              required
              className="input w-full"
              placeholder="+91 9876543210"
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <input
              name="businessAddress"
              required
              className="input w-full"
              placeholder="Business Address"
              onChange={handleChange}
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Upload size={16} />
              Business Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || categoriesLoading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Creating Business..." : "Create Business"}
          </button>

        </form>
      </div>
    </motion.div>
  );
};

export default CreateBusinessForm;
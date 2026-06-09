import { useState } from 'react';
import { Plus, Trash2, X, Tags, FolderTree, Layers, Sparkles, Grid3X3, ChevronRight } from 'lucide-react';
import { EmptyState } from '../EmptyState';

interface Subcategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface CategoryManagementTabProps {
  categories: Category[];
  onCreateCategory: (name: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  onDeleteCategory: (id: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  onCreateSubcategory: (categoryId: string, name: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

// Professional color palette for category cards
const categoryColors = [
  { bg: 'from-violet-500/10 to-purple-500/5', border: 'border-violet-200', icon: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
  { bg: 'from-blue-500/10 to-cyan-500/5', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  { bg: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  { bg: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  { bg: 'from-rose-500/10 to-pink-500/5', border: 'border-rose-200', icon: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
  { bg: 'from-indigo-500/10 to-blue-500/5', border: 'border-indigo-200', icon: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
];

export function CategoryManagementTab({
  categories,
  onCreateCategory,
  onDeleteCategory,
  onCreateSubcategory,
  onDeleteSubcategory,
}: CategoryManagementTabProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const result = await onCreateCategory(newCategoryName);
    if (result.success) {
      setNewCategoryName('');
      alert(result.message);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleCreateSubcategory = async (e: React.FormEvent, category: Category) => {
    e.preventDefault();
    if (!newSubcategoryName.trim()) return;

    const result = await onCreateSubcategory(category._id, newSubcategoryName);
    if (result.success) {
      setNewSubcategoryName('');
      setSelectedCategory(null);
      alert(result.message);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const result = await onDeleteCategory(categoryId);
      if (result.success) {
        alert(result.message);
      } else {
        alert('Error: ' + result.error);
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string, subcategoryName: string) => {
    if (window.confirm(`Are you sure you want to delete "${subcategoryName}"?`)) {
      const result = await onDeleteSubcategory(categoryId, subcategoryId);
      if (result.success) {
        alert(result.message);
      } else {
        alert('Error: ' + result.error);
      }
    }
  };

  const getColorScheme = (index: number) => categoryColors[index % categoryColors.length];

  const totalSubcategories = categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
              <FolderTree className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Category Management</h2>
          </div>
          <p className="text-muted-foreground">Organize your business categories and subcategories for better classification</p>
        </div>
        
        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
            <Grid3X3 className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">{categories.length} Categories</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
            <Layers className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">{totalSubcategories} Subcategories</span>
          </div>
        </div>
      </div>

      {/* Add New Category Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-100/50 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
              <Sparkles className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Create New Category</h3>
              <p className="text-sm text-muted-foreground">Add a parent category to organize your businesses</p>
            </div>
          </div>
          
          <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Tags className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Food & Beverages, Technology, Fashion..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" />
              Add Category
            </button>
          </form>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200 p-12">
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Create your first category above to start organizing your businesses"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((category, index) => {
            const colors = getColorScheme(index);
            const isExpanded = expandedCategory === category._id;
            const subcategoryCount = category.subcategories?.length || 0;

            return (
              <div 
                key={category._id} 
                className={`group relative bg-gradient-to-br ${colors.bg} rounded-2xl border ${colors.border} overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}
                style={{
                  opacity: 0,
                  animation: `slideInUp 0.4s ease-out ${index * 80}ms forwards`
                }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100/80 bg-white/60 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-white shadow-sm ${colors.icon}`}>
                      <FolderTree className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{category.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                          <Layers className="h-3 w-3" />
                          {subcategoryCount} items
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="p-2.5 rounded-xl bg-white/80 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Add Subcategory */}
                <div className="p-4 bg-white/40">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedCategory?._id === category._id ? newSubcategoryName : ''}
                      onChange={(e) => {
                        setSelectedCategory(category);
                        setNewSubcategoryName(e.target.value);
                      }}
                      onFocus={() => setExpandedCategory(category._id)}
                      placeholder="Add new subcategory..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                    <button
                      onClick={(e) => handleCreateSubcategory(e, category)}
                      disabled={selectedCategory?._id !== category._id || !newSubcategoryName.trim()}
                      className={`p-2.5 rounded-xl bg-white border border-slate-200 ${colors.icon} hover:bg-violet-50 hover:border-violet-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories List */}
                {subcategoryCount > 0 && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      {category.subcategories?.slice(0, isExpanded ? undefined : 3).map((subcategory, subIndex) => (
                        <div
                          key={subcategory._id}
                          className="group/item flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                          style={{
                            opacity: 0,
                            animation: `fadeIn 0.3s ease-out ${subIndex * 50}ms forwards`
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <ChevronRight className={`h-4 w-4 ${colors.icon}`} />
                            <span className="text-sm font-medium text-foreground">{subcategory.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSubcategory(category._id, subcategory._id, subcategory.name)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover/item:opacity-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      
                      {subcategoryCount > 3 && !isExpanded && (
                        <button
                          onClick={() => setExpandedCategory(category._id)}
                          className={`w-full py-2 text-sm font-medium ${colors.icon} hover:underline transition-all`}
                        >
                          Show {subcategoryCount - 3} more...
                        </button>
                      )}
                      
                      {isExpanded && subcategoryCount > 3 && (
                        <button
                          onClick={() => setExpandedCategory(null)}
                          className={`w-full py-2 text-sm font-medium ${colors.icon} hover:underline transition-all`}
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {subcategoryCount === 0 && (
                  <div className="px-4 pb-4">
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>No subcategories yet</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

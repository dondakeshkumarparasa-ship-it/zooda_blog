import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LoginScreen } from "@/components/admin/LoginScreen";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { AdminOverviewTab } from "@/components/admin/tabs/AdminOverviewTab";
import { AdminApprovalsTab } from "@/components/admin/tabs/AdminApprovalsTab";
import { AdminAnalyticsTab } from "@/components/admin/tabs/AdminAnalyticsTab";
import { CategoryManagementTab } from "@/components/admin/tabs/CategoryManagementTab";
import { BusinessManagementTab } from "@/components/admin/tabs/BusinessManagementTab";
import { AdminSettingsTab } from "@/components/admin/tabs/AdminSettingsTab";
import { AdminFeedbacksTab } from "@/components/admin/tabs/AdminFeedbacksTab";
import { AdminBlogsTab } from "@/components/admin/tabs/AdminBlogsTab";
import { AdminAiSettingsTab } from "@/components/admin/tabs/AdminAiSettingsTab";
import { AdminPagesTab } from "@/components/admin/tabs/AdminPagesTab";

const API_BASE = (localStorage.getItem("use_local_backend") === "true")
  ? "http://localhost:5000/api"
  : "https://api.zooda.in/api";
const DEFAULT_PASSWORD = "zooda";

// local keys
const LS_ADMIN_PASSWORD = "adminPassword";
const LS_ADMIN_FIRST = "adminHasAccessedBefore";
const LS_ADMIN_AUTH = "adminAuthenticated";

interface AdminData {
  pendingBusinesses: any[];
  approvedBusinesses: any[];
  platformStats: any;
  businessAnalytics: any[];
  categories: any[];
  allBusinesses: any[];
  feedbacks: any[];
}

const adminTabs = [
  { id: "overview", name: "Overview", icon: "fa-chart-bar" },
  { id: "approvals", name: "Business Approvals", icon: "fa-building" },
  { id: "analytics", name: "Business Analytics", icon: "fa-chart-line" },
  { id: "categories", name: "Categories", icon: "fa-tags" },
  { id: "businesses", name: "All Businesses", icon: "fa-store" },
  { id: "blogs", name: "Blogs Management", icon: "fa-book" },
  { id: "feedbacks", name: "Feedbacks", icon: "fa-comments" },
  { id: "ai-settings", name: "AI Configuration", icon: "fa-robot" },
  { id: "pages-content", name: "Page Editor", icon: "fa-file-alt" },
  { id: "settings", name: "Admin Settings", icon: "fa-cog" },
];

const Index = () => {
  const [adminData, setAdminData] = useState<AdminData>({
    pendingBusinesses: [],
    approvedBusinesses: [],
    platformStats: null,
    businessAnalytics: [],
    categories: [],
    allBusinesses: [],
    feedbacks: [],
  });

  const [adminLoading, setAdminLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  const [suspendReason, setSuspendReason] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);

  const [authenticated, setAuthenticated] = useState(false);

  // ✅ init local password and restore session
  useEffect(() => {
    const hasAccessedBefore = localStorage.getItem(LS_ADMIN_FIRST);

    if (!hasAccessedBefore) {
      localStorage.setItem(LS_ADMIN_PASSWORD, DEFAULT_PASSWORD);
      localStorage.setItem(LS_ADMIN_FIRST, "true");
    }

    // restore previous auth session (optional)
    const savedAuth = localStorage.getItem(LS_ADMIN_AUTH);
    if (savedAuth === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadAdminData();
    }
  }, [authenticated]);

  const makeAPIRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("adminToken");
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      if (response.status === 401) {
        return { success: false, error: "Session expired" };
      }
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || "Request failed" };
      }
      return { success: true, data };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const loadAdminData = async () => {
    setAdminLoading(true);
    try {
      const [
        pendingResult,
        approvedResult,
        statsResult,
        analyticsResult,
        categoriesResult,
        allBusinessesResult,
        feedbacksResult,
      ] = await Promise.all([
        makeAPIRequest("/admin/businesses?status=pending"),
        makeAPIRequest("/admin/businesses?status=approved"),
        makeAPIRequest("/admin/stats"),
        makeAPIRequest("/admin/analytics/businesses"),
        makeAPIRequest("/admin/categories"),
        makeAPIRequest("/admin/businesses"),
        makeAPIRequest("/admin/feedbacks"),
      ]);

      setAdminData({
        pendingBusinesses: pendingResult.success ? pendingResult.data : [],
        approvedBusinesses: approvedResult.success ? approvedResult.data : [],
        platformStats: statsResult.success ? statsResult.data : null,
        businessAnalytics: analyticsResult.success ? analyticsResult.data : [],
        categories: categoriesResult.success ? categoriesResult.data : [],
        allBusinesses: allBusinessesResult.success ? allBusinessesResult.data : [],
        feedbacks: feedbacksResult.success ? feedbacksResult.data : [],
      });
    } catch (error) {
      console.error("Error loading admin data:", error);
      setAdminData({
        pendingBusinesses: [],
        approvedBusinesses: [],
        platformStats: null,
        businessAnalytics: [],
        categories: [],
        allBusinesses: [],
        feedbacks: [],
      });
    } finally {
      setAdminLoading(false);
    }
  };

  // ====== actions ======
  const approveBusiness = async (businessId: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}/approve`, { method: "PUT" });
    if (result.success) {
      await loadAdminData();
      alert("Business approved successfully!");
    } else alert("Error approving business: " + result.error);
  };

  const rejectBusiness = async (businessId: string, reason: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
    if (result.success) {
      await loadAdminData();
      alert("Business rejected successfully!");
    } else alert("Error rejecting business: " + result.error);
  };

  const suspendBusiness = async (businessId: string, reason: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}/suspend`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
    if (result.success) {
      await loadAdminData();
      alert("Business suspended successfully!");
    } else alert("Error suspending business: " + result.error);
  };

  const activateBusiness = async (businessId: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}/activate`, { method: "PUT" });
    if (result.success) {
      await loadAdminData();
      alert("Business activated successfully!");
    } else alert("Error activating business: " + result.error);
  };

  const deleteBusiness = async (businessId: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}`, { method: "DELETE" });
    if (result.success) {
      await loadAdminData();
      alert("Business deleted successfully!");
    } else alert("Error deleting business: " + result.error);
  };

  const deletePost = async (businessId: string, postId: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}/posts/${postId}`, { method: "DELETE" });
    if (result.success) {
      alert("Post deleted successfully!");
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const deleteProduct = async (businessId: string, productId: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}/products/${productId}`, { method: "DELETE" });
    if (result.success) {
      alert("Product deleted successfully!");
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const deletePromotion = async (businessId: string, promotionId: string) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}/promotions/${promotionId}`, { method: "DELETE" });
    if (result.success) {
      alert("Promotion deleted successfully!");
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const updateBusiness = async (businessId: string, updateData: any) => {
    const result = await makeAPIRequest(`/admin/businesses/${businessId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
    if (result.success) {
      await loadAdminData();
      alert("Business updated successfully!");
    } else alert("Error updating business: " + result.error);
  };

  const fetchBusinessPosts = async (businessId: string) => {
    const result = await makeAPIRequest(`/post/${businessId}`);
    return result.success ? result.data : [];
  };

  const fetchBusinessProducts = async (businessId: string) => {
    const result = await makeAPIRequest(`/product/${businessId}`);
    return result.success ? result.data : [];
  };

  const fetchBusinessPromotions = async (businessId: string) => {
    const result = await makeAPIRequest(`/promotions/${businessId}`);
    return result.success ? result.data : [];
  };

  const createCategory = async (categoryName: string) => {
    const result = await makeAPIRequest("/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: categoryName }),
    });
    if (result.success) {
      await loadAdminData();
      return { success: true, message: "Category created successfully!" };
    }
    return { success: false, error: result.error };
  };

  const deleteCategory = async (categoryId: string) => {
    const result = await makeAPIRequest(`/admin/categories/${categoryId}`, { method: "DELETE" });
    if (result.success) {
      await loadAdminData();
      return { success: true, message: "Category deleted successfully!" };
    }
    return { success: false, error: result.error };
  };

  const createSubcategory = async (categoryId: string, subcategoryName: string) => {
    const result = await makeAPIRequest(`/admin/categories/${categoryId}/subcategories`, {
      method: "POST",
      body: JSON.stringify({ name: subcategoryName }),
    });
    if (result.success) {
      await loadAdminData();
      return { success: true, message: "Subcategory created successfully!" };
    }
    return { success: false, error: result.error };
  };

  const deleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    const result = await makeAPIRequest(`/admin/categories/${categoryId}/subcategories/${subcategoryId}`, {
      method: "DELETE",
    });
    if (result.success) {
      await loadAdminData();
      return { success: true, message: "Subcategory deleted successfully!" };
    }
    return { success: false, error: result.error };
  };

  // ✅ Login using local password
  const handlePasswordSubmit = (password: string) => {
    const savedPassword = localStorage.getItem(LS_ADMIN_PASSWORD) || DEFAULT_PASSWORD;

    if (password === savedPassword) {
      setAuthenticated(true);
      localStorage.setItem(LS_ADMIN_AUTH, "true");
    } else {
      alert("Incorrect password! Access denied.");
    }
  };

  // ✅ Logout clears auth
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem(LS_ADMIN_AUTH);
  };

  // ✅ reset password (called from settings tab)
  const handleResetPassword = (current: string, next: string) => {
    const savedPassword = localStorage.getItem(LS_ADMIN_PASSWORD) || DEFAULT_PASSWORD;

    if (current !== savedPassword) {
      return { success: false, error: "Current password is incorrect" };
    }
    localStorage.setItem(LS_ADMIN_PASSWORD, next);
    return { success: true };
  };

  const renderTabContent = () => {
    if (adminLoading) return <LoadingSpinner />;

    switch (activeTab) {
      case "overview":
        return <AdminOverviewTab stats={adminData.platformStats} />;

      case "approvals":
        return (
          <AdminApprovalsTab
            pendingBusinesses={adminData.pendingBusinesses}
            approvedBusinesses={adminData.approvedBusinesses}
            onApproveBusiness={approveBusiness}
            onRejectBusiness={rejectBusiness}
            onSuspendBusiness={suspendBusiness}
            onActivateBusiness={activateBusiness}
            showRejectModal={showRejectModal}
            setShowRejectModal={setShowRejectModal}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            showSuspendModal={showSuspendModal}
            setShowSuspendModal={setShowSuspendModal}
            suspendReason={suspendReason}
            setSuspendReason={setSuspendReason}
          />
        );

      case "analytics":
        return <AdminAnalyticsTab businessAnalytics={adminData.businessAnalytics} />;

      case "categories":
        return (
          <CategoryManagementTab
            categories={adminData.categories}
            onCreateCategory={createCategory}
            onDeleteCategory={deleteCategory}
            onCreateSubcategory={createSubcategory}
            onDeleteSubcategory={deleteSubcategory}
          />
        );

      case "businesses":
        return (
          <BusinessManagementTab
            businesses={adminData.allBusinesses}
            onDeleteBusiness={deleteBusiness}
            onDeletePost={deletePost}
            onDeleteProduct={deleteProduct}
            onDeletePromotion={deletePromotion}
            onUpdateBusiness={updateBusiness}
            fetchBusinessPosts={fetchBusinessPosts}
            fetchBusinessProducts={fetchBusinessProducts}
            fetchBusinessPromotions={fetchBusinessPromotions}
          />
        );

      case "blogs":
        return <AdminBlogsTab />;

      case "feedbacks":
        return (
          <AdminFeedbacksTab
            feedbacks={adminData.feedbacks}
            onRefresh={loadAdminData}
          />
        );

      case "ai-settings":
        return <AdminAiSettingsTab makeAPIRequest={makeAPIRequest} />;

      case "pages-content":
        return <AdminPagesTab />;

      case "settings":
        return (
          <AdminSettingsTab
            onLogout={handleLogout}
            onResetPassword={handleResetPassword}
          />
        );

      default:
        return <AdminOverviewTab stats={adminData.platformStats} />;
    }
  };

  if (!authenticated) {
    return <LoginScreen onSubmit={handlePasswordSubmit} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar
        tabs={adminTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          onRefresh={loadAdminData}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;

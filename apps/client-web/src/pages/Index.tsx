import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

// Components (adjust imports as needed)
import Notification from "@/components/ui/Notification";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthScreen from "@/components/auth/AuthScreen";
import DashboardScreen from "@/components/dashboard/DashboardScreen";
import PostsScreen from "@/components/posts/PostsScreen";
import ProductsScreen from "@/components/products/ProductsScreen";
import PromotionsScreen from "@/components/promotions/PromotionsScreen";
import Sidebar from "@/components/layout/Sidebar";
import BusinessProfileScreen from "@/components/business/BusinessProfileScreen";
import BusinessPendingScreen from "@/components/business/BusinessPendingScreen";
import { ChatbotWizard } from "@/components/Chat/Chatbot";

// Types
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

interface Business {
  _id: string;
  businessName: string;
  businessCategory: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessWebsite?: string;
  logoUrl?: string;
  user: User | string;
}

const safeParse = (data: string | null) => {
  try {
    return JSON.parse(data || "null");
  } catch {
    return null;
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(safeParse(localStorage.getItem("user")));
  const [business, setBusiness] = useState<Business | null | undefined>(
    safeParse(localStorage.getItem("business"))
  );
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const notify = useCallback((type: "success" | "error" | "info", message: string) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setBusiness(null);
    setBusinessError(null);
    setCurrentPage("login");
    notify("info", "Logged out successfully.");
  }, [notify]);

  // Shared business fetch logic
  const fetchBusiness = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;

    try {
      const res = await api.get("/business/me");
      if (res.data?.business) {
        const businessData = res.data.business;
        const fetchedUser = businessData.user;
        if (fetchedUser && typeof fetchedUser === "object") {
          setUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        }
        setBusiness(businessData);
        localStorage.setItem("business", JSON.stringify(businessData));
        setBusinessError(null);
        return businessData;
      } else {
        setBusiness(null);
        setBusinessError(null);
        localStorage.removeItem("business");
        return null;
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleLogout();
        notify("error", "Session expired. Please log in again.");
        return null;
      } else if (error.response?.status === 404) {
        setBusiness(null);
        setBusinessError(null);
        localStorage.removeItem("business");
        return null;
      } else {
        setBusinessError("Failed to load business. Please try again.");
        notify("error", "Network error. Please try again.");
        return null;
      }
    }
  }, [handleLogout, notify]);

  // Initial auth check
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsLoading(false);
        setCurrentPage("login");
        return;
      }
      setToken(storedToken);
      await fetchBusiness();
      setIsLoading(false);
      setCurrentPage("dashboard");
    };
    init();
  }, [fetchBusiness]);

  // Re-fetch business when token or user changes (e.g., after login)
  useEffect(() => {
    if (token && user) {
      fetchBusiness();
    }
  }, [token, user, fetchBusiness]);

  // Redirect to create-business if the user has no business profile
  useEffect(() => {
    if (token && user && business === null && !isLoading) {
      navigate("/create-business");
    }
  }, [token, user, business, isLoading, navigate]);

  // Poll business status every 10 seconds if pending/inactive/suspended
  useEffect(() => {
    let intervalId: any;
    if (token && user && business && business.status !== "active") {
      intervalId = setInterval(async () => {
        const updatedBusiness = await fetchBusiness();
        if (updatedBusiness && updatedBusiness.status === "active") {
          notify("success", "Your business listing has been approved!");
        }
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, user, business, fetchBusiness, notify]);

  const handleAuthSuccess = useCallback(
    (type: string, message: string, newToken?: string, newUser?: any) => {
      if (type === "success" && newToken && newUser) {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setCurrentPage("dashboard");
      }
      notify(type as "success" | "error" | "info", message);
    },
    [notify]
  );

  const handleAiSetupComplete = useCallback((botId: string) => {
    notify("success", "AI Chatbot is ready!");
    setCurrentPage("dashboard");
  }, [notify]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <LoadingSpinner text="Initializing..." size="lg" />
        </div>
      );
    }

    if (!token || !user) {
      return (
        <AuthScreen
          isRegister={authMode === "register"}
          onAuthSuccess={handleAuthSuccess}
          switchMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
        />
      );
    }

    // Gated Dashboard: block access if business is not active
    if (business && business.status !== 'active') {
      return <BusinessPendingScreen business={business} onLogout={handleLogout} />;
    }

    // Business required for most pages
    if (!business) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <LoadingSpinner text="Redirecting to business setup..." size="lg" />
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <DashboardScreen user={user} notify={notify} />;
      case "business-profile":
        return <BusinessProfileScreen user={user} notify={notify} />;
      case "posts":
        return <PostsScreen business={business} currentUser={user} notify={notify} businessError={businessError} onRetryBusiness={fetchBusiness} />;
      case "products":
        return <ProductsScreen business={business} currentUser={user} notify={notify} businessError={businessError} onRetryBusiness={fetchBusiness} />;
      case "promotions":
        return <PromotionsScreen business={business} currentUser={user} notify={notify} businessError={businessError} onRetryBusiness={fetchBusiness} />;
      case "ai-setup":
        return <ChatbotWizard businessId={business._id} onComplete={handleAiSetupComplete} />;
      default:
        return <DashboardScreen user={user} notify={notify} />;
    }
  };

  const isMainApp = token && user && business && business.status === "active";

  return (
    <div className={`font-sans ${isMainApp ? "flex min-h-screen bg-background" : "min-h-screen"}`}>
      {isMainApp && (
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          business={business}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <div className={isMainApp ? "flex-1 flex flex-col min-h-screen overflow-hidden" : "w-full"}>
        {isMainApp && (
          <header className="lg:hidden flex items-center justify-between bg-card border-b border-border p-4 sticky top-0 z-30">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-foreground hover:bg-secondary rounded-xl transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
                <Building className="text-white" size={16} />
              </div>
              <span className="font-bold text-foreground">Zooda</span>
            </div>
            <div className="w-10" />
          </header>
        )}
        <main className={isMainApp ? "flex-1 p-4 lg:p-6 overflow-y-auto" : ""}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AnimatePresence>
        {notification && (
          <div className="fixed top-4 right-4 z-50">
            <Notification {...notification} onClose={() => setNotification(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
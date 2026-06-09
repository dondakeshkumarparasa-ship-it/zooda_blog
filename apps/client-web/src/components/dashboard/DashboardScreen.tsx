import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Heart,
  ShoppingBag,
  Tag,
  Users,
  Calendar,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatCard from "@/components/ui/StatCard";
import "./DASstyles.css";

interface DashboardScreenProps {
  existingBusiness: any;
  user: any;
  notify: (type: string, message: string) => void;
}

type RangeKey = "1d" | "7d" | "15d" | "30d";

const RANGE_DAYS: Record<RangeKey, number> = {
  "1d": 1,
  "7d": 7,
  "15d": 15,
  "30d": 30,
};

type AnalyticsState = {
  impressions: number;
  clicks: number;
  ctr: number;
};

const DashboardScreen = ({ existingBusiness, user, notify }: DashboardScreenProps) => {
  const [business, setBusiness] = useState(existingBusiness);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [range, setRange] = useState<RangeKey>("7d");

  const [analytics, setAnalytics] = useState<AnalyticsState>({
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });

  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const businessId = business?._id;
  const hasBusiness = !!business?._id;

  const dateRange = useMemo(() => {
    const days = RANGE_DAYS[range];
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    return { from, to, days };
  }, [range]);

  
  const fetchBusiness = useCallback(async () => {
    try {
      const res = await axios.get("/business/me");

      if (res.data?.business) {
        setBusiness(res.data.business);
      }
    } catch (error) {
      console.log("No business found");
    }
  }, []);

  /**
   * Fetch Dashboard Data
   */
  const fetchDashboardData = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`/dashboard/${businessId}`, {
        params: { days: dateRange.days },
      });

      if (response.data?.success && response.data.dashboard) {
        setDashboardData(response.data.dashboard);
      } else {
        setDashboardData(null);
        notify("error", "Dashboard load failed.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Error loading dashboard data.";
      setError(errorMessage);
      notify("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [businessId, dateRange.days, notify]);

  /**
   * Fetch Analytics
   */
  const fetchCompanyAnalytics = useCallback(async () => {
    if (!businessId) return;

    try {
      setAnalyticsLoading(true);

      const res = await axios.get(`/analytics/company/${businessId}`, {
        params: { days: dateRange.days },
      });

      if (res.data?.success) {
        setAnalytics({
          impressions: Number(res.data.impressions || 0),
          clicks: Number(res.data.clicks || 0),
          ctr: Number(res.data.ctr || 0),
        });
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
      notify("error", "Failed to load analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  }, [businessId, dateRange.days, notify]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  useEffect(() => {
    fetchDashboardData();
    fetchCompanyAnalytics();
  }, [fetchDashboardData, fetchCompanyAnalytics]);

  const handleRefresh = () => {
    fetchBusiness();
    fetchDashboardData();
    fetchCompanyAnalytics();
  };

  /**
   * Loading
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner text="Loading Dashboard..." />
      </div>
    );
  }

  /**
   * No Business Created
   */
  if (!hasBusiness) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <BarChart3 size={60} className="text-muted-foreground mb-6" />

        <h2 className="text-2xl font-bold mb-3">
          No Business Created
        </h2>

        <p className="text-muted-foreground mb-8 max-w-md">
          Create your business profile to start tracking analytics,
          promotions, products and customer engagement.
        </p>

        <Link
          to="/create-business"
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          <PlusCircle size={18} />
          Create Business
        </Link>
      </motion.div>
    );
  }

  /**
   * Error
   */
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error}</p>

        <button onClick={handleRefresh} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) return null;

  const {
    stats = {},
    recentActivity = [],
  } = dashboardData;

  const {
    totalEngagement = 0,
    totalProducts = 0,
    totalPromotions = 0,
    followers = 0,
    totalPosts = 0,
  } = stats;

  const displayEngagement = totalEngagement > 0 ? totalEngagement : totalPosts;

  const impressions = analytics.impressions;
  const clicks = analytics.clicks;
  const ctr = analytics.ctr;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="p-3 bg-primary/10 rounded-xl">
            <BarChart3 className="text-primary" size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {business?.businessName || "Dashboard"}
            </h1>

            <p className="text-muted-foreground text-sm">
              Overview of your business performance
            </p>
          </div>

        </div>

        {/* Filters */}

        <div className="flex items-center gap-2">

          <div className="dashboard-range">

            {(["1d", "7d", "15d", "30d"] as RangeKey[]).map((key) => (
              <button
                key={key}
                className={`range-btn ${range === key ? "active" : ""}`}
                onClick={() => setRange(key)}
              >
                {key === "30d" ? "1 Month" : key.replace("d", " Day")}
              </button>
            ))}

          </div>

          <button onClick={handleRefresh} className="btn-ghost">
            <RefreshCw size={18} />
          </button>

        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard title="Engagement" value={displayEngagement} icon={<Heart size={24} />} gradient="success" delay={0} />

        <StatCard title="Products" value={totalProducts} icon={<ShoppingBag size={24} />} gradient="warning" delay={0.1} />

        <StatCard title="Promotions" value={totalPromotions} icon={<Tag size={24} />} gradient="purple" delay={0.2} />

        <StatCard title="Followers" value={followers} icon={<Users size={24} />} gradient="pink" delay={0.3} />

      </div>

      {/* Analytics */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <StatCard title="Impressions" value={analyticsLoading ? "..." : impressions} icon={<BarChart3 size={24} />} gradient="purple" />

        <StatCard title="Clicks" value={analyticsLoading ? "..." : clicks} icon={<BarChart3 size={24} />} gradient="success" />

        <StatCard title="CTR" value={analyticsLoading ? "..." : `${ctr.toFixed(2)}%`} icon={<BarChart3 size={24} />} gradient="warning" />

      </div>

      {/* Recent Activity */}

      <div className="bg-card rounded-2xl border border-border p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Activity
        </h2>

        {recentActivity.length === 0 ? (
          <p className="text-muted-foreground">
            No activity in last {dateRange.days} days
          </p>
        ) : (
          recentActivity.map((activity: any, i: number) => (
            <div key={i} className="py-3 border-b border-border">

              <p className="text-sm font-medium">
                {activity.description}
              </p>

              <p className="text-xs text-muted-foreground">
                {new Date(activity.time).toLocaleString()}
              </p>

            </div>
          ))
        )}

      </div>

    </motion.div>
  );
};

export default DashboardScreen;
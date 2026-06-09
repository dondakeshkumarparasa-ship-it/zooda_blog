import React, { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import logoUrl from './images/logo.png';
import { Eye, EyeOff, Bot, Send, MessageSquare, Sparkles, User, ArrowLeft, RefreshCw, Building, Lock, Search, Loader2, ChevronRight, ChevronLeft, Heart, MessageCircle, Share2 } from "lucide-react";


const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const slugify = (text: string) => {
  if (!text) return "business";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

const getPostUrl = (post: any) => {
  if (!post) return "";
  const title = post.title || post.caption || post.content || "post";
  const titleSlug = slugify(title).substring(0, 50);
  return `post-${titleSlug}-${post._id}`;
};

const DialoguePreloader = () => {
  const scenarios = [
    {
      left: "I am looking for a website for my business...",
      right: "You are at the right place!"
    },
    {
      left: "I am looking for a website for my occasion...",
      right: "You are at the right place!"
    },
    {
      left: "I am looking for a website to buy a product...",
      right: "You are at the right place!"
    },
    {
      left: "I am looking for a website for a service...",
      right: "You are at the right place!"
    }
  ];

  const [scenario] = useState(() => scenarios[Math.floor(Math.random() * scenarios.length)]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const leftTimer = setTimeout(() => setShowLeft(true), 600);
    const rightTimer = setTimeout(() => setShowRight(true), 2200);
    return () => {
      clearTimeout(leftTimer);
      clearTimeout(rightTimer);
    };
  }, []);

  return (
    <div id="preloader" className="dialogue-preloader-overlay">
      <div className="stage">
        <div className={`bubble bubble-left ${showLeft ? "show" : ""}`}>
          {scenario.left}
        </div>
        <div className="character char-left"></div>

        <div className="character char-right"></div>
        <div className={`bubble bubble-right ${showRight ? "show" : ""}`}>
          {scenario.right}
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

const PostsDialoguePreloader = () => {
  const scenarios = [
    {
      left: "Any exciting news.",
      right: "Yes watch out"
    },
    {
      left: "Any updates.",
      right: "Yes watch out!"
    },
    {
      left: "Any offers....",
      right: "Yes watch out"
    },
    {
      left: "Any discounts..",
      right: "Yes watch out"
    }
  ];

  const [scenario] = useState(() => scenarios[Math.floor(Math.random() * scenarios.length)]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const leftTimer = setTimeout(() => setShowLeft(true), 600);
    const rightTimer = setTimeout(() => setShowRight(true), 2200);
    return () => {
      clearTimeout(leftTimer);
      clearTimeout(rightTimer);
    };
  }, []);

  return (
    <div id="preloader" className="dialogue-preloader-overlay">
      <div className="stage">
        <div className={`bubble bubble-left ${showLeft ? "show" : ""}`}>
          {scenario.left}
        </div>
        <div className="character char-left"></div>

        <div className="character char-right"></div>
        <div className={`bubble bubble-right ${showRight ? "show" : ""}`}>
          {scenario.right}
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

const getFormattedUrl = (url: string) => {
  if (!url || url === "#") return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

// Interfaces
interface Product {
  _id?: string;
  imageUrl: string;
  price: string;
  category: string;
  name?: string;
  tags?: string[];
  productLink?: string;
  images?: Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>;
  companyId?: string;
  companyName?: string;
}

interface Comment {
  userId: string;
  text: string;
  date: Date;
  _id?: string;
}

interface Post {
  _id?: string;
  imageUrl: string;
  mediaUrl?: string;
  category: string;
  likes: number;
  comments: number;
  caption: string;
  content?: string;
  date: string;
  createdAt?: string;
  businessId?: string;
  business?: any;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  views?: number;
  shares?: number;
  likesList?: string[];
  commentsList?: Comment[];
  likesCount?: number;
  media?: Array<{
    url: string;
    type: string;
    filename?: string;
    originalName?: string;
    size?: number;
  }>;
}

interface Company {
  _id: string;
  rank: number;
  name: string;
  description: string;
  followers: string;
  trend: string;
  siteUrl: string;
  logoUrl: string;
  posts: Post[];
  postCategories: string[];
  products: Product[];
  productCategories: string[];
  totalPosts?: number;
  totalProducts?: number;
  engagementRate: string | number;
  followersList?: string[];
  businessName?: string;
  businessDescription?: string;
  businessWebsite?: string;
  businessLogo?: string;
  category?: string;
  subcategory?: string;
  botId?: string; 
}

interface User {
  _id?: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}
interface Promotion {
  _id?: string;
  id?: string;
  name: string;
  title?: string;
  description: string;
  image: string;
  imageUrl?: string;
  user?: string;
  business?: string;
  companyId?: string;
  businessId?: string;
  companyName?: string;
  startDate: string;
  endDate: string;
  discountCode?: string;
  couponCode?: string;
  discountType?: string;
  discountValue?: number;
  displayType: "banner" | "popup" | "general"; // Updated field
  type?: string; // Keep for backward compatibility
  isActive: boolean;
  status?: string;
  link?: string; // Updated field name
  targetUrl?: string; // Keep for backward compatibility
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  platforms?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = (localStorage.getItem("use_local_backend") === "true")
  ? "http://localhost:5000"
  : "https://zooda.vercel.app";



const getActivePromotions = async (): Promise<Promotion[]> => {
  try {
    const response = await axios.get(`https://zooda.vercel.app/api/promotion`);

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map((promo: any) => ({
        ...promo,
        type: promo.displayType,
        targetUrl: promo.link,
        _id: promo._id || promo.id,
      }));
    } else if (Array.isArray(response.data.promotions)) {
      return response.data.promotions;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching active promotions:", error);
    return [];
  }
};

const trackPromotionEvent = async (
  promotionId: string | undefined,
  type: string
) => {
  if (!promotionId) return;
  try {
    await axios.post(`${API_BASE_URL}/api/promotion/${promotionId}/track`, {
      type,
    });
  } catch (err) {
    console.error(`Failed to track ${type} for promotion`, err);
  }
};

interface PromotionBannerProps {
  promotion: Promotion;
  onClose?: () => void;
  onClaimOffer: (promotion: Promotion) => void;
}

const PromotionBanner = ({
  promotion,
  onClose,
  onClaimOffer,
}: PromotionBannerProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    trackPromotionEvent(promotion._id, "impression");
  }, [promotion._id]);

  const handleClick = () => {
    trackPromotionEvent(promotion._id, "click");
    onClaimOffer(promotion);
  };

  if (!visible) return null;

  // Use link field if targetUrl is not available
  const targetUrl = promotion.targetUrl || promotion.link;

  return (
    <div className="promotion-banner">
      {onClose && (
        <button className="banner-close" onClick={() => setVisible(false)}>
          {"\u00D7"}
        </button>
      )}
      <div className="banner-content" onClick={handleClick}>
        <img
          src={`${promotion.image}`}
          alt={promotion.name}
          className="banner-image"
        />
        <div className="banner-info">
          <h4>{promotion.name}</h4>
          <p>{promotion.description}</p>
          {promotion.discountCode && (
            <span className="discount-code">
              Use code: {promotion.discountCode}
            </span>
          )}
          {promotion.couponCode && (
            <span className="discount-code">
              Use code: {promotion.couponCode}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface PromotionPopupProps {
  promotion: Promotion;
  onClose: () => void;
  onClaimOffer: (promotion: Promotion) => void;
}

const PromotionPopup = ({
  promotion,
  onClose,
  onClaimOffer,
}: PromotionPopupProps) => {
  useEffect(() => {
    // Track impression
    trackPromotionEvent(promotion._id, "impression");

    // Mark promotion as shown
    const shownPromos = JSON.parse(
      localStorage.getItem("shownPromotions") || "[]"
    );
    if (!shownPromos.includes(promotion._id)) {
      shownPromos.push(promotion._id);
      localStorage.setItem("shownPromotions", JSON.stringify(shownPromos));
    }
  }, [promotion._id]);

  const handleClaimOffer = () => {
    trackPromotionEvent(promotion._id, "click");
    onClaimOffer(promotion);
  };

  return (
    <div className="promotion-popup-overlay" onClick={onClose}>
      <div
        className="promotion-popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="banner-close" onClick={onClose}>
          {"\u00D7"}
        </button>
        <img
          src={promotion.image}
          alt={promotion.name}
          className="promotion-popup-image"
        />
        <div className="promotion-popup-body">
          <h3>{promotion.name}</h3>
          <p>{promotion.description}</p>
          {(promotion.discountCode || promotion.couponCode) && (
            <div className="promotion-code">
              Use code:{" "}
              <strong>{promotion.discountCode || promotion.couponCode}</strong>
            </div>
          )}
          <button
            className="promotion-popup-claim-btn"
            onClick={handleClaimOffer}
          >
            Claim Offer Now
          </button>
        </div>
      </div>
    </div>
  );
};

interface SearchResult {
  id: string;
  name: string;
  type: "company" | "product";
  companyId?: string;
  companyName?: string;
  imageUrl?: string;
  price?: string;
}

interface SearchResult {
  id: string;
  name: string;
  type: "company" | "product";
  companyId?: string;
  companyName?: string;
  imageUrl?: string;
  price?: string;
}


const SearchPage = ({
  onSelectSearchResult,
  onSearchChange,
  onBack,
  onVisitSite,
}: {
  onSelectSearchResult: (product: any) => void;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  onVisitSite?: (company: any) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Responsive state for the 5-row layout limit
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchBusinesses();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxVisibleBusinesses = isMobile ? 5 : 15; // 5 rows of 1 in mobile, 5 rows of 3 in desktop

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/business/search`);
      const data = await res.json();
      if (data.success && Array.isArray(data.businesses)) {
        setBusinesses(data.businesses);
      }
    } catch (err) {
      console.error("Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const filtered = businesses.filter((business) => {
    const lowerQuery = searchQuery.toLowerCase();
    const businessMatches =
      business.businessName?.toLowerCase().includes(lowerQuery) ||
      business.businessDescription?.toLowerCase().includes(lowerQuery) ||
      business.businessCategory?.toLowerCase().includes(lowerQuery);

    const productMatches = business.products?.some((product: any) =>
      product.name?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery) ||
      product.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );

    return businessMatches || productMatches;
  });

  return (
    <div className="sp-search-page">
      {/* Header */}
      <header className="sp-app-header">
        <button onClick={onBack} className="sp-back-button">
          <span className="material-icons">arrow_back</span>
        </button>
        <div className="sp-search-input-wrapper">
          <span className="material-icons sp-search-icon">search</span>
          <input
            type="text"
            placeholder="Search businesses and products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="sp-search-page-input"
          />
          {searchQuery && (
            <button className="sp-search-clear" onClick={() => setSearchQuery("")}>
              <span className="material-icons">close</span>
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="sp-search-results-container">
        {loading ? (
          <div className="sp-search-loading">Loading businesses...</div>
        ) : filtered.length === 0 ? (
          <div className="sp-search-no-results">No businesses or products found.</div>
        ) : (
          <div className="sp-search-results-grid">
            {filtered.slice(0, maxVisibleBusinesses).map((business) => {
              const lowerQuery = searchQuery.toLowerCase();

              const matchedProducts = (business.products || []).filter((product: any) => {
                if (!searchQuery) return true;
                return (
                  product.name?.toLowerCase().includes(lowerQuery) ||
                  product.category?.toLowerCase().includes(lowerQuery) ||
                  product.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
                );
              });

              // Select matched product, or fall back to the first product of the business
              const featuredProduct = matchedProducts.length > 0
                ? matchedProducts[0]
                : (business.products && business.products.length > 0 ? business.products[0] : null);

              const companyName = business.businessName || "Business Name";
              const erRate = business.engagementRate || (business.er !== undefined ? business.er : "0");

              return (
                <div key={business._id} className="sp-business-block">
                  <div className="sp-business-card-header">
                    <img
                      src={business.logoUrl || "https://placehold.co/80x80?text=Logo"}
                      alt={companyName}
                      className="sp-business-logo"
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/80x80?text=Logo")}
                    />
                    <div className="sp-business-info">
                      <h3>{companyName}</h3>
                      <div className="sp-company-stats">
                        <span className="stat-followers">{business.followers ?? 0} followers</span>
                        <span className="stat-er">ER: {erRate}</span>
                      </div>
                    </div>
                  </div>

                  <p className="sp-business-desc select-all">
                    {business.businessDescription || "No description provided for this business."}
                  </p>

                  {featuredProduct ? (
                    <div className="sp-featured-product-box">
                      <div className="sp-product-preview-text">
                        <p className="product-title truncate select-all">
                          Product: <span className="product-value">{featuredProduct.name}</span>
                        </p>
                        <p className="product-price">
                          Price: <span className="price-value">â‚¹{featuredProduct.price || "N/A"}</span>
                        </p>
                      </div>
                      <button
                        className="sp-view-product-card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(featuredProduct);
                        }}
                      >
                        <span className="material-icons text-sm mr-1">visibility</span>
                        View Product
                      </button>
                    </div>
                  ) : (
                    <div className="sp-no-products-box select-all">
                      No products listed for this business.
                    </div>
                  )}

                  <div className="sp-card-actions">
                    {featuredProduct && (
                      <button
                        className="sp-mobile-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(featuredProduct);
                        }}
                      >
                        View
                      </button>
                    )}
                    <a
                      href={business.businessWebsite || business.siteUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-visit-site-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const webUrl = business.businessWebsite || business.siteUrl;
                        if (webUrl && onVisitSite) {
                          onVisitSite(business);
                        } else if (webUrl) {
                          window.open(webUrl, "_blank");
                        }
                      }}
                    >
                      <button 
                        className="sp-visit-site-btn" 
                        disabled={!(business.businessWebsite || business.siteUrl)}
                      >
                        {isMobile ? "Site" : "Visit site"}
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Popup */}
      {selectedProduct && (
        <div className="sp-image-popup-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="sp-image-popup" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedProduct.image?.url || selectedProduct.imageUrl || "https://placehold.co/300x200?text=Product"}
              alt={selectedProduct.name}
              onError={(e) => (e.currentTarget.src = "https://placehold.co/300x200?text=Product")}
            />
            <div className="sp-popup-details">
              <h3>{selectedProduct.name}</h3>
              <span className="sp-popup-price">â‚¹{selectedProduct.price || "N/A"}</span>
              <button
                className="sp-select-product-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSearchResult(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Select Product
              </button>
            </div>
            <button className="sp-close-popup" onClick={() => setSelectedProduct(null)}>
              {"\u2716"}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .sp-search-page {
          background: #ffffff;
          color: #1e293b;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }
        .sp-app-header {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 10;
          gap: 12px;
        }
        .sp-back-button {
          background: none;
          border: none;
          color: #1e293b;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          flex-shrink: 0;
        }
        /* Clean search bar â€” rectangular, single border, no pill */
        .sp-search-input-wrapper {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.45rem 0.85rem;
          flex: 1;
          gap: 8px;
          transition: border-color 0.2s;
        }
        .sp-search-input-wrapper:focus-within {
          border-color: #15A148;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(21, 161, 72, 0.08);
        }
        .sp-search-page-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #1e293b;
          outline: none;
          font-size: 0.9rem;
          font-family: 'Poppins', sans-serif;
        }
        .sp-search-page-input::placeholder {
          color: #94a3b8;
        }
        .sp-search-icon {
          color: #94a3b8;
          font-size: 20px;
          flex-shrink: 0;
        }
        .sp-search-clear {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          flex-shrink: 0;
        }
        .sp-search-clear:hover { color: #475569; }

        .sp-search-results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .sp-search-results-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        /* Business card â€” clean white, single border */
        .sp-business-block {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .sp-business-block:hover {
          border-color: #15A148;
          box-shadow: 0 4px 16px rgba(21, 161, 72, 0.1);
        }

        .sp-business-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.6rem;
        }
        .sp-business-logo {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          object-fit: contain;
          background: #f8fafc;
          flex-shrink: 0;
        }
        .sp-business-info h3 {
          margin: 0;
          color: #0f172a;
          font-size: 0.9rem;
          font-weight: 700;
          text-align: left;
          font-family: 'Poppins', sans-serif;
        }
        .sp-company-stats {
          display: flex;
          gap: 10px;
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 2px;
          font-family: 'Poppins', sans-serif;
        }
        .sp-company-stats span { color: #64748b; }
        .stat-er {
          color: #15A148 !important;
          font-weight: 600;
        }

        .sp-business-desc {
          font-size: 0.75rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0.4rem 0 0.8rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 32px;
          text-align: left;
          font-family: 'Poppins', sans-serif;
        }

        /* Featured product box â€” clean, no double border */
        .sp-featured-product-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.65rem 0.75rem;
          margin-bottom: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }
        .sp-product-preview-text p {
          margin: 0;
          font-size: 0.75rem;
          color: #475569;
          font-family: 'Poppins', sans-serif;
        }
        .product-title { font-weight: 600; color: #1e293b; }
        .product-value { color: #1e293b; font-weight: 700; }
        .product-price { margin-top: 2px !important; font-size: 0.75rem; }
        .price-value { color: #15A148; font-weight: 700; }

        .sp-view-product-card-btn {
          width: 100%;
          background: #15A148;
          color: #fff;
          border: none;
          padding: 7px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .sp-view-product-card-btn:hover { background: #0f8a3a; }

        /* No-products box â€” clean, no double border */
        .sp-no-products-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: center;
          margin-bottom: 0.8rem;
          font-family: 'Poppins', sans-serif;
        }

        .sp-card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .sp-visit-site-link { flex: 1; text-decoration: none; }
        .sp-visit-site-btn {
          width: 100%;
          background: #1b4fd8;
          border: none;
          color: #ffffff;
          padding: 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sp-visit-site-btn:hover:not(:disabled) { background: #123cb2; }
        .sp-visit-site-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .sp-no-products,
        .sp-search-loading,
        .sp-search-no-results {
          padding: 2rem;
          color: #94a3b8;
          text-align: center;
          font-family: 'Poppins', sans-serif;
        }

        .sp-image-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }
        .sp-image-popup {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 16px;
          position: relative;
          width: 90%;
          max-width: 380px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        .sp-image-popup img {
          width: 100%;
          max-height: 250px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 1rem;
        }
        .sp-popup-details h3 { margin: 0 0 0.5rem 0; color: #0f172a; font-size: 1.3rem; }
        .sp-popup-price {
          color: #15A148;
          margin-top: 4px;
          font-weight: 700;
          font-size: 1.1rem;
          display: block;
          margin-bottom: 1rem;
        }
        .sp-select-product-btn {
          background: #15A148;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          width: 100%;
          transition: background 0.2s;
        }
        .sp-select-product-btn:hover { background: #0f8a3a; }
        .sp-close-popup {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e293b;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sp-close-popup:hover { background: #e2e8f0; }

        /* Mobile layout â€” horizontal card row */
        @media (max-width: 767px) {
          .sp-search-results-grid {
            gap: 8px;
            padding: 0.75rem;
          }
          .sp-business-block {
            flex-direction: row;
            align-items: center;
            padding: 10px 12px;
            gap: 10px;
            border-radius: 10px;
            min-height: 68px;
            justify-content: space-between;
          }
          .sp-business-card-header {
            flex: 1.2;
            min-width: 0;
            margin-bottom: 0;
            gap: 8px;
          }
          .sp-business-logo {
            width: 36px;
            height: 36px;
          }
          .sp-business-info h3 {
            font-size: 0.78rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 108px;
          }
          .sp-company-stats {
            gap: 5px;
            font-size: 0.63rem;
            margin-top: 1px;
          }
          .sp-business-desc { display: none !important; }
          .sp-featured-product-box {
            background: transparent;
            border: none;
            padding: 0;
            margin-bottom: 0;
            flex: 1;
            min-width: 0;
            text-align: left;
          }
          .sp-product-preview-text { flex-direction: column; }
          .sp-product-preview-text p {
            font-size: 0.63rem !important;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 88px;
          }
          .sp-view-product-card-btn { display: none !important; }
          .sp-no-products-box {
            background: transparent;
            border: none;
            padding: 0;
            font-size: 0.63rem;
            color: #94a3b8;
            margin-bottom: 0;
            text-align: left;
            flex: 1;
          }
          .sp-card-actions {
            flex-direction: column;
            gap: 4px;
            flex-shrink: 0;
            width: 52px;
            margin-top: 0;
          }
          .sp-mobile-view-btn {
            width: 100%;
            background: #15A148;
            color: #fff;
            border: none;
            padding: 4px 6px;
            border-radius: 6px;
            font-size: 0.63rem;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
            text-align: center;
            transition: background 0.2s;
          }
          .sp-mobile-view-btn:hover { background: #0f8a3a; }
          .sp-visit-site-btn {
            padding: 4px 6px;
            font-size: 0.63rem;
            border-radius: 6px;
          }
        }
        
        @media (min-width: 768px) {
          .sp-mobile-view-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// ---------------- HEADER COMPONENT ----------------
interface HeaderProps {
  title?: string;
  onBack?: () => void;
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onRegister?: () => void;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  currentRoute?: string;
  onLogoClick?: () => void;
  onBackArrowClick?: () => void;
  onNavigate?: (path: string) => void;
}

const Header = ({
  title,
  onBack,
  user,
  onLogin,
  onLogout,
  onRegister,
  onMenuToggle,
  isMenuOpen,
  onSearchClick,
  onProfileClick,
  currentRoute,
  onLogoClick,
  onBackArrowClick,
  onNavigate,
}: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (onBack) {
    return (
      <header className="app-header app-header--navigation">
        <button onClick={onBack} className="back-button" aria-label="Go back">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="header-title">{title}</h1>
        <div className="header-placeholder" />
      </header>
    );
  }

  if (title) {
    return (
      <header className="app-header app-header--centered">
        <h1 className="header-title">{title}</h1>
      </header>
    );
  }

  const showBackArrow = currentRoute && currentRoute !== 'home';

  return (
    <header className="app-header flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Left side: Back Arrow & Logo */}
      <div className="flex items-center gap-3">
        {showBackArrow && (
          <button 
            onClick={onBackArrowClick} 
            className="text-black hover:text-black flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition-all duration-200" 
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="header-logo cursor-pointer flex items-center gap-2 hover:opacity-90 active:scale-95 transition" onClick={onLogoClick} aria-label="Zetova logo">
          <img src={logoUrl} alt="Logo" className="h-11 md:h-14 object-contain logo-image" />
        </div>
      </div>

      {/* Middle side: Desktop Navigation tabs / menu links */}
      <nav className="hidden md:flex items-center gap-2">
        <button
          onClick={() => onNavigate?.("/")}
          className={`text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-xl transition-all ${
            currentRoute === "home"
              ? "text-[#15A148] bg-[#15A148]/10 border border-[#15A148]/20 shadow-sm"
              : "text-slate-700 hover:text-black hover:bg-slate-100 border border-transparent"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate?.("/posts")}
          className={`text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-xl transition-all ${
            currentRoute === "posts"
              ? "text-[#15A148] bg-[#15A148]/10 border border-[#15A148]/20 shadow-sm"
              : "text-slate-700 hover:text-black hover:bg-slate-100 border border-transparent"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => onNavigate?.("/chats")}
          className={`text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-xl transition-all ${
            currentRoute === "chats" || currentRoute === "chat"
              ? "text-[#15A148] bg-[#15A148]/10 border border-[#15A148]/20 shadow-sm"
              : "text-slate-700 hover:text-black hover:bg-slate-100 border border-transparent"
          }`}
        >
          Chats
        </button>
      </nav>

      {/* Middle-Right side: Search bar (Desktop) or Search icon (Mobile) */}
      <div className="flex items-center gap-1">
        {/* Desktop Search Bar */}
        <div 
          className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-slate-50/60 border border-slate-200/80 rounded-xl cursor-pointer transition-all hover:border-[#15A148]/80 hover:bg-white hover:shadow-sm w-64 lg:w-80" 
          onClick={onSearchClick}
        >
          <span className="material-icons text-black text-sm">search</span>
          <input
            type="text"
            placeholder="Search companies and products..."
            readOnly
            className="sp-header-search-input bg-transparent text-xs text-slate-700 outline-none w-full cursor-pointer pointer-events-none font-poppins"
            style={{fontFamily: "'Poppins', sans-serif"}}
          />
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={onSearchClick}
          className="flex md:hidden items-center justify-center w-8 h-8 text-black hover:text-black hover:bg-slate-100 rounded-full transition active:scale-95"
          aria-label="Search"
        >
          <span className="material-icons text-lg">search</span>
        </button>

        {/* Account / Profile Dropdown (Both) */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-black p-[2px] transition duration-300 hover:scale-105 active:scale-95 focus:outline-none"
                aria-label="View Profile"
                title="View Profile"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <span className="material-icons text-black text-lg">person</span>
                </div>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.12)] py-1 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Logged in as</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onNavigate?.("/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-black transition-all flex items-center gap-2"
                  >
                    <span className="material-icons text-base">edit</span>
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-all flex items-center gap-2 border-t border-slate-100"
                  >
                    <span className="material-icons text-base">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center justify-center w-8 h-8 text-black hover:text-black hover:bg-slate-100 rounded-full transition active:scale-95"
              aria-label="Login or Register"
              title="Login or Register"
            >
              <span className="material-icons text-lg">login</span>
            </button>
          )}
        </div>

        {/* Hamburger Menu Toggle (Mobile ONLY) */}
        <button
          className="flex md:hidden items-center justify-center w-8 h-8 text-black hover:text-black hover:bg-slate-100 rounded-full transition active:scale-95"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span className="material-icons text-lg">{isMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>
    </header>
  );
};


const UserProfilePage = ({
  user,
  onBack,
  onSelectCompany,
  onLogout,
  allCompanies,
  API_BASE_URL,
  axios,
}: UserProfilePageProps) => {

  const [followingBusinesses, setFollowingBusinesses] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || "",
    bio: user.bio || "",
    website: user.website || "",
  });

  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  /* ---------------- FETCH FOLLOWING ---------------- */
  const fetchFollowingBusinesses = useCallback(async () => {
    if (!user._id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/user/${user._id}/following`
      );
      const followedIds = response.data.following || [];
      const companies = allCompanies.filter(c =>
        followedIds.includes(c._id)
      );
      setFollowingBusinesses(companies);
    } catch (err: any) {
      setError("Failed to load followed businesses");
    } finally {
      setLoading(false);
    }
  }, [user._id, allCompanies, API_BASE_URL, axios]);

  useEffect(() => {
    fetchFollowingBusinesses();
  }, [fetchFollowingBusinesses]);

  /* ---------------- INPUT CHANGE ---------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- IMAGE CHANGE ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file)); // preview
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      setError("");

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("mobile", formData.mobile);
      payload.append("bio", formData.bio);
      payload.append("website", formData.website);

      if (profileImageFile) {
        payload.append("profileImage", profileImageFile);
      }

      await axios.put(
        `${API_BASE_URL}/api/user/${user._id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  /* ---------------- CANCEL EDIT ---------------- */
  const handleCancelEdit = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      bio: user.bio || "",
      website: user.website || "",
    });
    setProfileImage(user.profileImage || "");
    setProfileImageFile(null);
    setIsEditing(false);
  };

  return (
    <div className="user-profile-page">
      <style>{profilepage}</style>

      <main className="profile-content">

        {/* PROFILE */}
        <section className="profile-section">
          <div className="profile-header-card">

            {/* AVATAR */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-container">
                {profileImage ? (
                  <img src={profileImage} className="profile-avatar" />
                ) : (
                  <span className="material-icons profile-avatar-icon">
                    account_circle
                  </span>
                )}

                {isEditing && (
                  <label className="avatar-upload-label">
                    <span className="material-icons">edit</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                )}
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-profile-btn"
                >
                  <span className="material-icons">edit</span>
                  Edit Profile
                </button>
              )}
            </div>

            {/* DETAILS */}
            <div className="profile-details">
              {isEditing ? (
                <div className="edit-form">

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="form-input"
                  />

                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="form-input"
                  />

                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Mobile Number"
                    maxLength={10}
                    className="form-input"
                  />

                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Website"
                    className="form-input"
                  />

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Bio"
                    rows={4}
                    className="form-textarea"
                  />

                  <div className="form-actions">
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="btn btn-primary"
                      disabled={saveLoading}
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="profile-info">
                  <h1>{user.name}</h1>
                  <p>{user.email}</p>
                  {user.mobile && <p>ðŸ“± {user.mobile}</p>}
                  {user.website && (
                    <a href={user.website} target="_blank">
                      {user.website}
                    </a>
                  )}
                  {user.bio && <p>{user.bio}</p>}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* LOGOUT */}
        <section className="logout-section">
          <button onClick={onLogout} className="btn btn-danger">
            <span className="material-icons">logout</span>
            Logout
          </button>
        </section>

      </main>
    </div>
  );
};
const profilepage = `
.user-profile-page {
  /* Set overall background to black */
  background: #000000;
  min-height: 100vh;
  color: #ffffff;
}

.user-profile-page .profile-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #363636;
  background: #000000;
  position: sticky;
  top: 0;
  z-index: 100;
}

.user-profile-page .back-button {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.user-profile-page .back-button:hover {
  background: #1f1f1f; /* Darker hover for black background */
}

.user-profile-page .profile-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.user-profile-page .profile-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-profile-page .profile-section {
  margin-bottom: 30px;
}

.user-profile-page .profile-header-card {
  background: #121212; /* Slightly off-black card background */
  border: 1px solid #363636;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.profile-avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #363636;
}

.profile-avatar-icon {
  font-size: 120px;
  color: #555555;
}

.avatar-upload-label {
  position: absolute;
  bottom: 5px;
  right: 5px;
  /* Green color */
  background: #4ade80; 
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #000000;
}

.avatar-upload-label .material-icons {
  font-size: 18px;
  color: #000000; /* Text on green should be black/dark */
}

.avatar-upload-input {
  display: none;
}

.edit-profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #363636;
  border: 1px solid #555555;
  border-radius: 6px;
  padding: 8px 16px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.edit-profile-btn:hover {
  background: #555555;
}

.profile-details {
  flex: 1;
}

.profile-info .user-name {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #ffffff;
}

.profile-info .user-email {
  font-size: 16px;
  color: #a8a8a8;
  margin: 0 0 12px 0;
}

.profile-info .user-phone,
.profile-info .user-website {
  font-size: 14px;
  color: #a8a8a8;
  margin: 0 0 8px 0;
  display: block;
}

.profile-info .user-website {
  /* Green link color */
  color: #4ade80; 
  text-decoration: none;
}

.profile-info .user-website:hover {
  text-decoration: underline;
  /* Darker green on hover */
  color: #16a34a; 
}

.profile-info .user-bio {
  font-size: 16px;
  line-height: 1.5;
  color: #ffffff;
  margin: 16px 0 0 0;
}

/* Edit Form Styles */
.edit-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 6px;
}

.form-input,
.form-textarea {
  width: 100%;
  background: #000000;
  border: 1px solid #363636;
  border-radius: 6px;
  padding: 12px;
  color: #ffffff;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  /* Green focus border */
  border-color: #4ade80; 
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

/* Button Styles */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.user-profile-page .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-profile-page .btn-outline {
  background: transparent;
  border: 1px solid #363636;
  color: #ffffff;
}

.user-profile-page .btn-outline:hover:not(:disabled) {
  background: #363636;
}

/* Primary Button (Green) */
.user-profile-page .btn-primary {
  background: #4ade80; /* Primary Green */
  color: #000000; /* Black text for contrast */
}

.user-profile-page .btn-primary:hover:not(:disabled) {
  background: #16a34a; /* Darker Green on hover */
  color: #ffffff;
}

/* Danger Button (Red) */
.user-profile-page .btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

/* Following Section */
.following-section {
  background: #121212; /* Slightly off-black card background */
  border: 1px solid #363636;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.follow-count {
  font-size: 14px;
  color: #000000;
  background: #4ade80; /* Green badge */
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
}

/* Loading, Error, and Empty States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a8a8a8;
}

.loading-state .material-icons,
.error-state .material-icons,
.empty-state .material-icons {
  font-size: 48px;
  margin-bottom: 16px;
  color: #555555;
}

.error-state .material-icons {
  color: #dc2626;
}

.empty-subtext {
  font-size: 14px;
  margin-top: 8px;
  color: #666666;
}

/* Businesses Grid */
.businesses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.business-card {
  background: #000000;
  border: 1px solid #363636;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.business-card:hover {
  border-color: #4ade80; /* Green hover border */
  transform: translateY(-2px);
}

.business-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #363636;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.business-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.business-avatar .material-icons {
  font-size: 24px;
  color: #a8a8a8;
}

.business-info {
  flex: 1;
}

.business-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #ffffff;
}

.business-category {
  font-size: 14px;
  color: #a8a8a8;
  margin: 0 0 8px 0;
}

.business-stats {
  display: flex;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #a8a8a8;
}

.stat .material-icons {
  font-size: 14px;
}

/* Logout Section */
.logout-section {
  text-align: center;
  padding: 20px 0;
}

.logout-btn {
  min-width: 120px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-content {
    padding: 16px;
  }

  .profile-header-card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  /* Ensure profile details align left in edit form on mobile */
  .profile-header-card .profile-details {
  width: 100%;
    text-align: left;
  }


  .profile-avatar-section {
    width: 100%;
  }

  .businesses-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .form-actions {
    /* Stack buttons vertically on small screens */
    flex-direction: column;
    gap: 8px; /* Slightly reduced gap for stacked buttons */
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  /* Reduce padding on the main card */
  .user-profile-page .profile-header-card {
    padding: 16px;
  }

  .profile-avatar-container {
    width: 100px;
    height: 100px;
  }

  .profile-avatar-icon {
    font-size: 100px;
  }

  .profile-info .user-name {
    font-size: 24px;
  }
}
`;
const styleSheets = document.createElement("style");
styleSheets.innerText = profilepage;
document.head.appendChild(styleSheets);
const PrivacyPolicyPage = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pages/privacy`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
        } else {
          setPageData({
            title: 'Privacy Policy',
            content: `<h2>Privacy Policy</h2>\n<p>Last updated: 20 November 2025</p>\n<p>Your privacy is important to us. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Zooda.in.</p>`,
            updatedAt: '2025-11-20T00:00:00.000Z'
          });
        }
      })
      .catch(err => {
        console.error("Error loading privacy page, falling back to static content:", err);
        setPageData({
          title: 'Privacy Policy',
          content: `<h2>Privacy Policy</h2>\n<p>Last updated: 20 November 2025</p>\n<p>Your privacy is important to us. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Zooda.in.</p>`,
          updatedAt: '2025-11-20T00:00:00.000Z'
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="max-w-3xl mx-auto bg-black border border-white/10 rounded-xl p-6 shadow-lg">
        {loading ? (
          <div className="text-center py-10">Loading Privacy Policy...</div>
        ) : pageData ? (
          <>
            <header className="mb-6">
              <h2 className="text-3xl font-extrabold text-green-400">{pageData.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                Last updated: {new Date(pageData.updatedAt).toLocaleDateString()}
              </p>
            </header>
            <section 
              className="space-y-6 leading-relaxed text-gray-300 rich-text-content"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/?type=home"
                onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/"); window.dispatchEvent(new Event("popstate")); }}
                className="px-5 py-2 rounded-full bg-[#15A148] text-black font-semibold hover:bg-[#15A148] transition"
              >
                Back to Home
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-red-500">Failed to load Privacy Policy.</div>
        )}
      </div>
    </div>
  );
};

const TermsPage = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pages/terms`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
        } else {
          setPageData({
            title: 'Terms & Conditions',
            content: `<h2>Terms & Conditions</h2>\n<p>Last updated: 20 November 2025</p>\n<p>By using Zooda.in, you agree to the terms below. Please read carefully before listing or interacting with our platform.</p>`,
            updatedAt: '2025-11-20T00:00:00.000Z'
          });
        }
      })
      .catch(err => {
        console.error("Error loading terms page, falling back to static content:", err);
        setPageData({
          title: 'Terms & Conditions',
          content: `<h2>Terms & Conditions</h2>\n<p>Last updated: 20 November 2025</p>\n<p>By using Zooda.in, you agree to the terms below. Please read carefully before listing or interacting with our platform.</p>`,
          updatedAt: '2025-11-20T00:00:00.000Z'
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="max-w-3xl mx-auto bg-black border border-white/10 rounded-xl p-6 shadow-lg">
        {loading ? (
          <div className="text-center py-10">Loading Terms & Conditions...</div>
        ) : pageData ? (
          <>
            <header className="mb-6">
              <h2 className="text-3xl font-extrabold text-green-400">{pageData.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                Last updated: {new Date(pageData.updatedAt).toLocaleDateString()}
              </p>
            </header>
            <section 
              className="space-y-6 leading-relaxed text-gray-300 rich-text-content"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/?type=home"
                onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/"); window.dispatchEvent(new Event("popstate")); }}
                className="px-5 py-2 rounded-full bg-[#15A148] text-black font-semibold hover:bg-[#15A148] transition"
              >
                Browse Listings
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-red-500">Failed to load Terms & Conditions.</div>
        )}
      </div>
    </div>
  );
};

const AboutPage = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pages/about`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
        } else {
          setPageData({
            title: 'About Us',
            content: `<h2>Welcome to Zooda.in</h2>\n<p>Zooda.in is India's growing digital platform dedicated to helping business owners showcase their online presence and reach the right audience.</p>\n<p>We created Zooda.in with a simple vision — to build a centralized, transparent, and engagement-driven marketplace where businesses with websites can stand out, connect with customers, and grow faster.</p>`
          });
        }
      })
      .catch(err => {
        console.error("Error loading about page, falling back to static content:", err);
        setPageData({
          title: 'About Us',
          content: `<h2>Welcome to Zooda.in</h2>\n<p>Zooda.in is India's growing digital platform dedicated to helping business owners showcase their online presence and reach the right audience.</p>\n<p>We created Zooda.in with a simple vision — to build a centralized, transparent, and engagement-driven marketplace where businesses with websites can stand out, connect with customers, and grow faster.</p>`
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <section className="max-w-5xl mx-auto bg-black border border-white/10 rounded-xl shadow-xl overflow-hidden p-6 md:p-10">
        {loading ? (
          <div className="text-center py-10">Loading About Us...</div>
        ) : pageData ? (
          <>
            <h2 className="text-3xl font-extrabold mb-6 text-green-400">
              {pageData.title}
            </h2>
            <div 
              className="text-gray-300 leading-relaxed space-y-6 rich-text-content"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/?type=home"
                onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/"); window.dispatchEvent(new Event("popstate")); }}
                className="px-5 py-3 rounded-full bg-[#15A148] text-black font-semibold hover:bg-[#15A148] transition"
              >
                Explore Listings
              </a>
              <a
                href="/contact"
                onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/contact"); window.dispatchEvent(new Event("popstate")); }}
                className="px-5 py-3 rounded-full border border-green-500 text-green-400 hover:bg-white/5 transition"
              >
                Contact Us
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-red-500">Failed to load About Us.</div>
        )}
      </section>
    </div>
  );
};

const ContactPage = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pages/contact`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
        } else {
          setPageData({
            title: 'Contact Us',
            content: `<h2>Contact Us</h2>\n<p>Feel free to reach out to us at support@zooda.in or send us a message through our platform.</p>`,
            metadata: { email: 'zoodanew@gmail.com', phone: '', address: 'Vijayawada, India' }
          });
        }
      })
      .catch(err => {
        console.error("Error loading contact page, falling back to static content:", err);
        setPageData({
          title: 'Contact Us',
          content: `<h2>Contact Us</h2>\n<p>Feel free to reach out to us at support@zooda.in or send us a message through our platform.</p>`,
          metadata: { email: 'zoodanew@gmail.com', phone: '', address: 'Vijayawada, India' }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="max-w-3xl mx-auto bg-black border border-white/10 rounded-xl p-6 shadow-lg">
        {loading ? (
          <div className="text-center py-10">Loading Contact Information...</div>
        ) : pageData ? (
          <>
            <header className="mb-6">
              <h2 className="text-3xl font-extrabold text-green-400">{pageData.title}</h2>
            </header>
            <section 
              className="space-y-6 leading-relaxed text-gray-300 rich-text-content mb-8"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
            
            {/* Dynamic Metadata details */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">Our Details</h3>
              <div className="space-y-3">
                {pageData.metadata?.email && (
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="material-icons text-green-400">email</span>
                    <strong>Email:</strong> <a href={`mailto:${pageData.metadata.email}`} className="text-green-400 hover:underline">{pageData.metadata.email}</a>
                  </p>
                )}
                {pageData.metadata?.phone && (
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="material-icons text-green-400">phone</span>
                    <strong>Phone:</strong> {pageData.metadata.phone}
                  </p>
                )}
                {pageData.metadata?.address && (
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="material-icons text-green-400">place</span>
                    <strong>Address:</strong> {pageData.metadata.address}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <a
                href="/?type=home"
                onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/"); window.dispatchEvent(new Event("popstate")); }}
                className="px-5 py-2 rounded-full bg-[#15A148] text-black font-semibold hover:bg-[#15A148] transition"
              >
                Back to Home
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-red-500">Failed to load Contact information.</div>
        )}
      </div>
    </div>
  );
};


interface CompanyListItemProps {
  company: Company;
  onSelectCompany: (company: Company) => void;
  user?: User;
  onLoginClick?: () => void;
  onVisitSite?: (company: Company) => void;
}

const CompanyListItem = ({
  company,
  onSelectCompany,
  user,
  onLoginClick,
  onVisitSite,
}: CompanyListItemProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(company.followers || 1);

  /* ===============================
     IMPRESSION TRACKING (ON RENDER)
  ================================ */
  useEffect(() => {
    if (!company?._id) return;

    axios
      .post(`${API_BASE_URL}/api/analytics/impression`, {
        companyId: company._id,
        userId: user?._id,
      })
      .catch(() => {});
  }, [company._id]);

  /* ===============================
     FOLLOW STATUS
  ================================ */
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user?._id && company._id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/follow/${company._id}/status/${user._id}`
          );
          if (response.data.success) {
            setIsFollowing(response.data.isFollowing);
            if (typeof response.data.followers === "number") {
              setFollowers(response.data.followers);
            }
          }
        } catch (err) {
          console.error("Error checking follow status:", err);
        }
      }
    };
    checkFollowStatus();
  }, [user?._id, company._id]);

  /* ===============================
     FOLLOW ACTION
  ================================ */
  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user?._id) {
      onLoginClick?.();
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/follow/${company._id}`,
        { userId: user._id }
      );
      if (response.data.success) {
        setIsFollowing(response.data.isFollowing);
        setFollowers(response.data.followers || 1);
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  /* ===============================
     VISIT SITE WITH ANALYTICS TRACKING
  ================================ */
  const handleVisit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const rawUrl = company.siteUrl || company.businessWebsite || company.website || "#";
    const formattedUrl = getFormattedUrl(rawUrl);
    
    try {
      // Track the visit site click
      await axios.post(`${API_BASE_URL}/api/analytics/visit`, {
        companyId: company._id,
        userId: user?._id,
        url: formattedUrl,
        type: 'external_link'
      });
    } catch (error) {
      // Silent fail - don't prevent user from visiting site
      console.error('Visit tracking error:', error);
    }
    
    if (onVisitSite) {
      onVisitSite(company);
    } else if (formattedUrl !== "#") {
      window.open(formattedUrl, "_blank");
    }
  };

  /* ===============================
     CLICK TRACKING + SELECT
  ================================ */
  const handleCompanyClick = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/analytics/click`, {
        companyId: company._id,
        userId: user?._id,
        type: 'company_card'
      });
    } catch {
      // silent fail
    }

    onSelectCompany(company);
  };

  return (
    <article
      className="company-card"
      onClick={handleCompanyClick}
      aria-labelledby={`company-name-${company.rank}`}
      role="button"
      tabIndex={0}
    >
      <div className="company-row single-line">
        <img src={company.logoUrl} alt="Logo" className="company-logo" />

        <div className="company-info">
          <h2 id={`company-name-${company.rank}`} className="company-name">
            {company.name}
          </h2>

          <div className="company-stats">
            <span>
              {Number(company.followers) > 0 ? Number(company.followers) : 0} Followers
            </span>

            {company.engagementRate > 0 ? (
              <div className="stat-item">
                <span className="stat-label">{company.engagementRate}%</span>
              </div>
            ) : (
              <div className="stat-item">
                <span className="stat-label">NEW</span>
              </div>
            )}

            <button className="visit-btn" onClick={handleVisit}>
              Visit site
            </button>

            <button
              className={`follow-btn ${isFollowing ? "following" : ""}`}
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow +"}
            </button>
          </div>

          <p className="company-description">{company.description}</p>
        </div>
      </div>
    </article>
  );
};

interface CompanyListPageProps {
  onSelectCompany: (company: Company) => void;
  user?: User;
  allPromotions: Promotion[];
  onClaimOffer: (promotion: Promotion) => void;
  onVisitSite?: (company: Company) => void;
}

const CompanyListPage = ({
  onSelectCompany,
  user,
  allPromotions,
  onClaimOffer,
  onVisitSite,
}: CompanyListPageProps) => {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"All Businesses" | "Top Ranked">(
    "All Businesses"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [currentPopupPromotion, setCurrentPopupPromotion] =
    useState<Promotion | null>(null);
  const [usedPromotions, setUsedPromotions] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = isMobile ? 10 : 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, activeTab]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const categoryNames = data.map((cat: any) => cat.name);
        setCategories(["All", ...categoryNames]);
      } else if (data.success && Array.isArray(data.categories)) {
        const categoryNames = data.categories.map((cat: any) => cat.name);
        setCategories(["All", ...categoryNames]);
      } else {
        setCategories(["All", "Ecommerce", "LMS", "Technology", "Food", "Fashion"]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories(["All", "Ecommerce", "LMS", "Technology", "Food", "Fashion"]);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubcategories = async (category: string) => {
    if (category === "All") {
      setSubcategories(["All"]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`);
      const data = await response.json();
      
      let categoriesData: any[] = [];
      if (Array.isArray(data)) {
        categoriesData = data;
      } else if (data.success && Array.isArray(data.categories)) {
        categoriesData = data.categories;
      }

      const selectedCat = categoriesData.find((cat: any) => cat.name === category);
      
      if (selectedCat && Array.isArray(selectedCat.subcategories)) {
        const subcategoryNames = selectedCat.subcategories.map((sub: any) => sub.name);
        setSubcategories(["All", ...subcategoryNames]);
      } else {
        setSubcategories(["All", "General"]);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubcategories(["All", "General"]);
    }
  };

  // Filter active promotions based on displayType
  const bannerPromotions = allPromotions.filter((promo) => {
    const isActive = promo.isActive && new Date(promo.endDate) > new Date();
    const isBanner = promo.displayType === "banner" || promo.type === "banner";
    return isActive && isBanner;
  });

  const popupPromotions = allPromotions.filter((promo) => {
    const isActive = promo.isActive && new Date(promo.endDate) > new Date();
    const isPopup = promo.displayType === "popup" || promo.type === "popup";
    return isActive && isPopup && !usedPromotions.includes(promo._id!);
  });

  // Show popup promotion on mount
  useEffect(() => {
    if (popupPromotions.length > 0 && !showPromotionPopup) {
      const availablePopup = popupPromotions[0];
      setTimeout(() => {
        setCurrentPopupPromotion(availablePopup);
        setShowPromotionPopup(true);
        setUsedPromotions((prev) => [...prev, availablePopup._id!]);
      }, 2000);
    }
  }, [popupPromotions.length, showPromotionPopup]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    fetchSubcategories(selectedCategory);
  }, [selectedCategory]);

  // Fetch all businesses once (no category filter)
  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/business/all`);
        const data = await response.json();

        if (Array.isArray(data)) {
         const companiesWithStats = await Promise.all(
  data.map(async (item, index) => {
    try {
      const postsResponse = await fetch(`${API_BASE_URL}/api/post/${item._id}`);
      const postsData = await postsResponse.json();
      const posts = postsData.posts || [];

      const productsResponse = await fetch(`${API_BASE_URL}/api/product/${item._id}`);
      const productsData = await productsResponse.json();
      const products = productsData.products || [];

      const engagementRate = item.engagementRate || 0.0;

      return {
        _id: item._id,
        rank: index + 1,
        name: item.businessName || "Unnamed Business",
        description: item.businessDescription || "No description available",
        followers: item.followers,
        trend: "Rising",
        siteUrl: item.businessWebsite || "#",
        logoUrl: item.logoUrl,
        posts,
        products,
        totalPosts: posts.length,
        totalProducts: products.length,
        engagementRate,
        category: item.businessCategory || "Ecommerce",
        subcategory: item.subcategory || "General",
        botId: item.botId,   // âœ… critical line
      } as Company;
    } catch (error) {
      // If fetching posts/products fails, still return basic info
      return {
        _id: item._id,
        rank: index + 1,
        name: item.businessName || "Unnamed Business",
        description: item.businessDescription || "No description available",
        followers: item.followers,
        trend: "Rising",
        siteUrl: item.businessWebsite || "#",
        logoUrl: item.logoUrl,
        posts: [],
        products: [],
        engagementRate: 0.0,
        category: item.businessCategory || "Ecommerce",
        subcategory: item.subcategory || "General",
        botId: item.botId,   // âœ… critical line
      } as Company;
    }
  })
);

          companiesWithStats.sort(
            (a, b) =>
              (b.engagementRate as number) - (a.engagementRate as number)
          );
          companiesWithStats.forEach((c, index) => (c.rank = index + 1));

          setAllCompanies(companiesWithStats);
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCompanies();
  }, []);

  // Local filtering
  const filteredCompanies = React.useMemo(() => {
    let list = [...allCompanies];

    if (selectedCategory !== "All") {
      list = list.filter((c) => c.category && c.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
    }

    if (selectedSubcategory !== "All") {
      list = list.filter((c) => c.subcategory && c.subcategory.trim().toLowerCase() === selectedSubcategory.trim().toLowerCase());
    }

    if (activeTab === "Top Ranked") {
      return list.sort(
        (a, b) => (b.engagementRate as number) - (a.engagementRate as number)
      );
    } else {
      return shuffleArray(list);
    }
  }, [allCompanies, selectedCategory, selectedSubcategory, activeTab]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const paginatedCompanies = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  // Insert banner after every 3 companies
  const zigzagContent = React.useMemo(() => {
    const content: Array<Company | Promotion> = [];
    let bannerIndex = 0;

    paginatedCompanies.forEach((company, index) => {
      content.push(company);
      if ((index + 1) % 3 === 0 && bannerPromotions.length > 0) {
        const bannerPromotion =
          bannerPromotions[bannerIndex % bannerPromotions.length];
        content.push(bannerPromotion);
        bannerIndex++;
      }
    });

    return content;
  }, [paginatedCompanies, bannerPromotions]);

  const handleClosePopup = () => {
    setShowPromotionPopup(false);
    setCurrentPopupPromotion(null);
  };

  const handleClaimOfferFromPopup = () => {
    if (currentPopupPromotion) {
      onClaimOffer(currentPopupPromotion);
      handleClosePopup();
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setSelectedSubcategory("All");
  };

  // Handle login request
  const handleLoginRequest = () => {
    setShowLoginModal(true);
  };

  // Handle successful login
  const handleLoginSuccess = (userData: User) => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };



  return (
    <>
      <main className="company-list-container">
        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "All Businesses" ? "active" : ""}`}
              onClick={() => setActiveTab("All Businesses")}
            >
              All Businesses
            </button>
            <button
              className={`tab ${activeTab === "Top Ranked" ? "active" : ""}`}
              onClick={() => setActiveTab("Top Ranked")}
            >
              Top Ranked
            </button>
          </div>
        </div>

        <div className="filters-container-swiggy">
          <div className="filter-dropdown-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500 }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                const cat = e.target.value;
                setSelectedCategory(cat);
                setCurrentPage(1);
                fetchSubcategories(cat);
                setSelectedSubcategory("All");
              }}
              className="elegant-category-filter"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company List + Banners */}
        <div className="company-cards-grid">
          {loading ? (
            <DialoguePreloader />
          ) : zigzagContent.length > 0 ? (
            zigzagContent.map((item, index) => {
              if ("rank" in item) {
                return (
                  <div key={`company-${item._id}-${index}`} className="company-card-wrapper">
                    <CompanyListItem
                      company={{
                        ...item,
                        engagementRate: (item.engagementRate as number).toFixed(1),
                      }}
                      onSelectCompany={onSelectCompany}
                      user={user}
                      onLoginClick={handleLoginRequest}
                      onVisitSite={onVisitSite}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={`banner-${item._id}-${index}`} className="banner-card-wrapper">
                    <PromotionBanner
                      promotion={item as Promotion}
                      onClaimOffer={onClaimOffer}
                    />
                  </div>
                );
              }
            })
          ) : (
            <div className="no-companies-message">
              No businesses found for selected filters.
            </div>
          )}
        </div>

        {/* Polished Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 mb-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {(() => {
                const maxButtons = 5;
                let startPage = Math.max(currentPage - 2, 1);
                let endPage = Math.min(startPage + maxButtons - 1, totalPages);
                if (endPage - startPage < maxButtons - 1) {
                  startPage = Math.max(endPage - maxButtons + 1, 1);
                }
                const pageButtons = [];
                for (let i = startPage; i <= endPage; i++) {
                  pageButtons.push(i);
                }
                return pageButtons;
              })().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl border font-bold text-xs transition-all ${
                    currentPage === page
                      ? "bg-[#15A148] text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                      : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Popup Promotion */}
        {showPromotionPopup && currentPopupPromotion && (
          <PromotionPopup
            promotion={currentPopupPromotion}
            onClose={handleClosePopup}
            onClaimOffer={handleClaimOfferFromPopup}
          />
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
        onOpenRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleLoginSuccess}
        onOpenLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};
const comstyles = `
.company-list-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: #000000;
  min-height: 100vh;
  color: #ffffff;
}

/* Tabs */
.tabs-container {
  border-bottom: 1px solid #363636;
  margin-bottom: 20px;
  background: #000000;
}

.tabs {
  display: flex;
  max-width: 100%;
  margin: 0 auto;
}

.tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #a8a8a8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab.active {
  color: #ffffff;
  border-bottom-color: #ffffff;
}

.tab:hover {
  color: #ffffff;
  background: #121212;
}

.filters-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #000000;
  border-bottom: 1px solid #363636;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 200px;
  position: relative;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.filter-select {
  background: #1a1a1a;
  border: 1px solid #363636;
  border-radius: 6px;
  padding: 10px 12px;
  color: #ffffff;
  font-size: 14px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #00ff99;
}

.company-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0 20px;
}

.company-card-wrapper {
  background: #000000;
  border: 1px solid #363636;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.company-card-wrapper:hover {
  transform: translateY(-2px);
  border-color: #555555;
}

.banner-card-wrapper {
  grid-column: 1 / -1;
  margin: 10px 0;
}

.no-companies-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #a8a8a8;
  background: #000000;
  font-size: 16px;
}

.app-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.text-default {
  color: #ffffff;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .company-list-container {
    padding: 10px;
  }

  .tabs {
    flex-direction: row;
  }

  .tab {
    padding: 6px 8px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-align: center;
  }

  .filters-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .company-cards-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 0;
  }

  .banner-card-wrapper {
    grid-column: 1;
    margin: 5px 0;
  }

  .company-card-wrapper:hover {
    transform: none;
    border-color: #363636;
  }

  /* All stats + both buttons in one row on mobile */
  .company-stats {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    gap: 5px !important;
    overflow: visible !important;
  }

  .follow-btn {
    padding: 3px 7px !important;
    font-size: 10px !important;
    height: 22px !important;
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    align-self: center !important;
    margin: 0 !important;
  }

  .visit-btn {
    padding: 3px 7px !important;
    font-size: 10px !important;
    height: 22px !important;
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    align-self: center !important;
    margin: 0 !important;
  }

  .company-stats span {
    font-size: 10px !important;
    white-space: nowrap !important;
  }

  .elegant-category-filter {
    font-size: 11px !important;
    padding: 5px 10px !important;
    padding-right: 28px !important;
  }

  .filters-container-swiggy {
    padding: 6px 10px !important;
    margin-bottom: 8px !important;
  }
}


/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .company-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-card-wrapper {
    grid-column: 1 / -1;
  }
}

/* Ensure the banner appears after every 3 companies */
.company-cards-grid > .company-card-wrapper:nth-child(3n) {
  /* This ensures proper wrapping */
}

/* Global body background */
body {
  background: #ffffff !important;
  color: #0f172a !important;
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #363636;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}
`;

// Add this style to your document
const comstylesElement = document.createElement("style");
comstylesElement.innerText = comstyles;
document.head.appendChild(comstylesElement);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavClick: (page: string) => void;
  user?: User;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  onProfileClick: () => void;
}

const MobileMenu = ({
  isOpen,
  onClose,
  activePage,
  onNavClick,
  user,
  onLogin,
  onRegister,
  onLogout,
  onProfileClick,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  const handleNavClick = (page: string) => {
    onNavClick(page);
    onClose();
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    onClose();
  };

  const handleProfileClick = () => {
    onProfileClick();
    onClose();
  };

  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header">
           <div className="header-logo" aria-label="Zetova logo">
        <img src={logoUrl} alt="Logo" className="logo-image" />
      </div>
          <button onClick={onClose} className="mobile-menu-close">
            <span className="material-icons">close</span>
          </button>
        </div>

        <nav className="mobile-menu-nav">
          <a
            href="#"
            className={`mobile-menu-item ${
              activePage === "Home" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Home");
            }}
          >
            <span className="material-icons">home</span>
            <span>Home</span>
          </a>
          <a
            href="#"
            className={`mobile-menu-item ${
              activePage === "About" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("About");
            }}
          >
            <span className="material-icons">info</span>
            <span>About Us</span>
          </a>
          <a
            href="#"
            className={`mobile-menu-item ${
              activePage === "Posts" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Posts");
            }}
          >
            <span className="material-icons">article</span>
            <span>All Posts</span>
          </a>
          <a
            href="#"
            className={`mobile-menu-item ${
              activePage === "Chats" || activePage === "chats" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Chats");
            }}
          >
            <span className="material-icons">chat</span>
            <span>Chats</span>
          </a>
          {user?.isLoggedIn && (
            <a
              href="#"
              className={`mobile-menu-item ${
                activePage === "Profile" ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleProfileClick();
              }}
            >
              <span className="material-icons">account_circle</span>
              <span>My Profile</span>
            </a>
          )}
        </nav>

        <div className="mobile-menu-auth">
          {user?.isLoggedIn ? (
            <div className="mobile-menu-user">
              <span className="user-greeting">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-menu-auth-buttons">
              <button onClick={onLogin} className="btn btn-outline">
                Login
              </button>
              <button onClick={onRegister} className="btn btn-solid">
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Banner = () => {
  return (
    <section 
      className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 lg:p-10 my-6 mx-4 shadow-2xl transition-all hover:border-zinc-700/80"
      style={{
        boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.1)"
      }}
    >
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#15A148]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-transparent rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        <div className="flex-1 space-y-4 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#15A148]/10 text-[#15A148] border border-[#15A148]/20 uppercase tracking-wider">
            <Sparkles size={12} /> Optimized for Online Storefronts
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Zooda: <br />
            <span className="text-[#15A148]">
              AI-Powered Online Business Hub
            </span>
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Zooda connects you instantly to premium online businesses. Browse modern digital storefronts, explore rich product catalogs, and converse directly with intelligent 24/7 AI storefront assistants trained to answer company queries and convert visitors into customers!
          </p>
          
          <div className="flex flex-wrap gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
              ðŸ¤– 24/7 AI Store Assistants
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
              ðŸ›ï¸ Online Storefronts Hub
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
              ðŸ’¬ Instant Customer Chats
            </span>
          </div>
        </div>
        
        {/* Right side illustration / premium visual representation */}
        <div className="relative w-full md:w-auto flex justify-center md:justify-end items-center flex-shrink-0">
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
            {/* Pulsing neon rings */}
            <div className="absolute inset-0 rounded-full border border-[#15A148]/20 animate-ping opacity-75" />
            <div className="absolute inset-4 rounded-full border-2 border-[#15A148]/30 animate-pulse" />
            
            {/* Visual element */}
            <div className="relative z-10 w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center shadow-inner group">
              <div className="absolute -top-3 -right-3 bg-[#15A148] text-white p-2 rounded-2xl shadow-lg border border-[#15A148]/30">
                <Bot size={20} className="animate-bounce" />
              </div>
              
              <div className="absolute -bottom-3 -left-3 bg-[#0f8a3a] text-white p-2 rounded-2xl shadow-lg border border-[#15A148]/30">
                <MessageSquare size={20} />
              </div>
              
              <div className="text-center p-3 space-y-1">
                <span className="text-3xl font-extrabold tracking-tighter text-[#15A148]">ZOODA</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">AI PLATFORM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
interface InstagramPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  company: Company;
  postsList?: Post[];
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => Promise<{ success: boolean; error?: string }>;
  onShare: (post: Post) => void;
  user: any;
  onLoginRequest?: () => void;
  navigate: (path: string) => void;
}

const InstagramPostModal = ({
  isOpen,
  onClose,
  post: initialPost,
  company,
  postsList = [],
  onLike,
  onComment,
  onShare,
  user,
  onLoginRequest,
  navigate
}: InstagramPostModalProps) => {
  const [currentPost, setCurrentPost] = useState<Post>(initialPost);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialPost.commentsList || []);
  const [likesCount, setLikesCount] = useState(initialPost.likes || initialPost.likesCount || 0);
  const [isLiked, setIsLiked] = useState(initialPost.isLiked || false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Local follow status for the current business post
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setCurrentPost(initialPost);
    setComments(initialPost.commentsList || []);
    setLikesCount(initialPost.likes || initialPost.likesCount || 0);
    setIsLiked(initialPost.isLiked || false);
  }, [initialPost]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user?._id || !company._id) return;
      try {
        const res = await axios.get(
          `https://zooda.vercel.app/api/follow/${company._id}/status/${user._id}`
        );
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status in modal:", err);
      }
    };
    checkFollowStatus();
  }, [user?._id, company._id, currentPost]);

  if (!isOpen || !currentPost) return null;

  const currentIndex = postsList.findIndex((p) => p._id === currentPost._id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevPost = postsList[currentIndex - 1];
      setCurrentPost(prevPost);
      setComments(prevPost.commentsList || []);
      setLikesCount(prevPost.likes || prevPost.likesCount || 0);
      setIsLiked(prevPost.isLiked || false);
      navigate(`post-${prevPost._id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < postsList.length - 1 && currentIndex !== -1) {
      const nextPost = postsList[currentIndex + 1];
      setCurrentPost(nextPost);
      setComments(nextPost.commentsList || []);
      setLikesCount(nextPost.likes || nextPost.likesCount || 0);
      setIsLiked(nextPost.isLiked || false);
      navigate(`post-${nextPost._id}`);
    }
  };

  const handleLocalLike = () => {
    if (!user) {
      onLoginRequest?.();
      return;
    }
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => prev + (newLiked ? 1 : -1));
    onLike(currentPost._id!);
  };

  const handleFollow = async () => {
    if (!user?._id) {
      onLoginRequest?.();
      return;
    }
    setFollowLoading(true);
    try {
      const res = await axios.post(`https://zooda.vercel.app/api/follow/${company._id}`, {
        userId: user._id,
      });
      if (res.data.success) {
        setIsFollowing(res.data.isFollowing);
      }
    } catch (err) {
      console.error("Follow error in modal:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLocalCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onLoginRequest?.();
      return;
    }
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    const res = await onComment(currentPost._id!, commentText.trim());
    if (res.success) {
      const newComment: Comment = {
        userId: user.name || "You",
        text: commentText.trim(),
        date: new Date()
      };
      setComments(prev => [...prev, newComment]);
      setCommentText("");
    } else {
      alert(res.error || "Failed to submit comment");
    }
    setSubmittingComment(false);
  };

  const username = company.name.toLowerCase().replace(/[\s.]/g, "_");

  return (
    <div className="instagram-modal-overlay" onClick={onClose}>
      {/* Floating Prev Button (Desktop only) */}
      {currentIndex > 0 && (
        <button className="instagram-nav-arrow prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
          <ChevronLeft size={36} />
        </button>
      )}

      {/* Floating Next Button (Desktop only) */}
      {currentIndex < postsList.length - 1 && currentIndex !== -1 && (
        <button className="instagram-nav-arrow next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
          <ChevronRight size={36} />
        </button>
      )}

      <div className="instagram-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button (rendered inside card for absolute precision) */}
        <button className="instagram-modal-close" onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
        {/* LEFT PANE: Media */}
        <div className="instagram-media-pane">
          <img
            src={currentPost.imageUrl}
            alt="Post content"
            onError={(e) => (e.currentTarget.src = `https://picsum.photos/800/800?random=${currentPost._id}`)}
          />
        </div>

        {/* RIGHT PANE: Detail & Interactions */}
        <div className="instagram-detail-pane">
          {/* Header (Author) */}
          <div className="instagram-detail-header border-b border-black">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-8 h-8 rounded-full object-contain border border-black bg-white p-0.5"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-black leading-none">{company.name.toLowerCase()}</span>
                  <span className="text-black text-[10px]">•</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFollow(); }}
                    disabled={followLoading}
                    className="text-xs font-bold text-blue-500 hover:text-blue-700 transition focus:outline-none"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
              <button className="text-black hover:text-slate-800">
                <span className="material-icons text-sm">more_horiz</span>
              </button>
            </div>
          </div>

          {/* Body: Caption and Comments */}
          <div className="instagram-detail-body scrollbar-thin">
            {/* Caption */}
            {(currentPost.content || currentPost.caption) && (
              <div className="instagram-caption-item flex gap-2">
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="text-xs">
                  <span className="font-bold text-black mr-1.5">{username}</span>
                  <span className="text-black leading-relaxed font-medium">{currentPost.content || currentPost.caption}</span>
                </div>
              </div>
            )}

            {/* Comments List */}
            {comments.map((c, i) => {
              const commenterName = c.userId && typeof c.userId === "object"
                ? ((c.userId as any).name || (c.userId as any).username || `${(c.userId as any).firstName || ""} ${(c.userId as any).lastName || ""}`.trim() || "User")
                : (c.userId || "User");
              const initial = commenterName.charAt(0).toUpperCase() || "U";
              return (
                <div key={i} className="instagram-comment-item flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                    {initial}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-black mr-1.5">{commenterName}</span>
                    <span className="text-black leading-relaxed font-medium">{c.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Row & Likes */}
          <div className="instagram-action-footer border-t border-black">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-4">
                <button onClick={handleLocalLike} className="transition-transform active:scale-90 flex items-center justify-center">
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                </button>
                <button onClick={() => document.getElementById("instagram-comment-input")?.focus()} className="text-black flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button onClick={() => onShare(currentPost)} className="text-black flex items-center justify-center">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-3 pb-2">
              <span className="text-xs font-bold text-black">{likesCount} likes</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleLocalCommentSubmit} className="instagram-comment-form border-t border-black bg-slate-50">
              <input
                id="instagram-comment-input"
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="text-xs bg-transparent w-full text-black placeholder:text-black outline-none font-medium"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                className="text-xs font-bold text-blue-500 hover:text-blue-600 disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};



interface AllPostsPageProps {
  onSelectPost: (post: Post, company?: Company) => void;
  user?: User;
  onLoginRequest?: () => void;
  onVisitSite?: (company: Company) => void;
}

const AllPostsPage = ({ onSelectPost, user, onLoginRequest, onVisitSite }: AllPostsPageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"Following" | "Unfollowing" | "Discover">("Following");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [allCaughtUp, setAllCaughtUp] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [activeCommentsPost, setActiveCommentsPost] = useState<{ post: Post, company: Company } | null>(null);

  // Force 'Discover' tab if not logged in
  useEffect(() => {
    if (!user?._id) setActiveTab("Discover");
    else if (activeTab === "Discover") setActiveTab("Following");
  }, [user?._id, activeTab]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setAllCaughtUp(false);

      let fetchedRawPosts: Post[] = [];

      // ==========================================
      // GUEST MODE: Fetch all posts from all businesses
      // ==========================================
      if (!user?._id) {
        console.log('Fetching all public posts...');
        const businessRes = await axios.get(`https://zooda.vercel.app/api/business/all`);
        const businesses = Array.isArray(businessRes.data) ? businessRes.data : businessRes.data.businesses || [];

        let allPublicPosts: any[] = [];

        await Promise.all(businesses.map(async (business: any) => {
          try {
            const postRes = await axios.get(`https://zooda.vercel.app/api/post/${business._id}`);
            const bPosts = postRes.data.posts || [];

            const formattedPosts = bPosts.map((post: any, i: number) => {
              let imageUrl = post.media?.[0]?.url || post.mediaUrl || post.imageUrl || `https://picsum.photos/600/400?random=${business._id}-${i}`;
              if (!imageUrl.startsWith("http")) {
                imageUrl = `https://zooda.vercel.app${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
              }

              let logoUrl = business.logoUrl;
              if (logoUrl && !logoUrl.startsWith("http")) {
                logoUrl = `https://zooda.vercel.app${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
              }

              return {
                ...post,
                _id: post._id || `post-${business._id}-${i}`,
                imageUrl,
                company: {
                  _id: business._id,
                  businessName: business.businessName || "Unknown Business",
                  name: business.businessName || "Unknown Business",
                  username: (business.businessName || "unknown").toLowerCase().replace(/[\s.]/g, "_"),
                  logoUrl: logoUrl || null,
                  siteUrl: business.siteUrl || business.businessWebsite || business.website || null,
                  businessWebsite: business.businessWebsite || null,
                  website: business.website || null
                },
                likesCount: post.likesCount || post.likes || 0,
                commentsCount: post.commentsCount || post.comments || 0,
                isLiked: false,
                likes: post.likesCount || post.likes || 0,
                comments: post.commentsCount || post.comments || 0
              };
            });
            allPublicPosts = [...allPublicPosts, ...formattedPosts];
          } catch (err) {
            console.error(`Error fetching posts for business ${business._id}:`, err);
          }
        }));

        fetchedRawPosts = allPublicPosts;
      } else {
        // ==========================================
        // LOGGED IN MODE: Fetch Following/Unfollowing
        // ==========================================
        const endpoint = activeTab === "Following"
          ? `https://zooda.vercel.app/api/posts/following/${user._id}`
          : `https://zooda.vercel.app/api/posts/unfollowed/${user._id}`;

        console.log('Fetching posts from:', endpoint);
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data.success && Array.isArray(data.posts)) {
          const processed = await Promise.all(
            data.posts.map(async (post: any, i: number) => {
              let imageUrl = post.media?.[0]?.url || post.mediaUrl || post.imageUrl || `https://picsum.photos/600/400?random=${i}`;
              if (!imageUrl.startsWith("http")) imageUrl = `https://zooda.vercel.app${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

              let company = null;
              const companyId = post.business?._id || post.business;
              
              if (companyId) {
                try {
                  const companyResponse = await axios.get(`https://zooda.vercel.app/api/companies/${companyId}`);
                  if (companyResponse.data.success) {
                    company = companyResponse.data.company;
                    if (company.logoUrl) {
                      let logoUrl = company.logoUrl;
                      if (!logoUrl.startsWith("http")) logoUrl = `https://zooda.vercel.app${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
                      company.logoUrl = logoUrl;
                    }
                    if (company.businessName) {
                      company.username = company.businessName.toLowerCase().replace(/[\s.]/g, "_");
                      company.name = company.businessName;
                    }
                  }
                } catch (err) {
                  company = { _id: companyId, businessName: "Unknown Business", name: "Unknown Business", username: "unknown_business", logoUrl: null };
                }
              }

              let isLiked = false;
              try {
                const likeResponse = await axios.get(`https://zooda.vercel.app/api/post/${post._id}/like-status/${user._id}`);
                if (likeResponse.data.success !== false) isLiked = likeResponse.data.isLiked || false;
              } catch (err) {
                isLiked = false;
              }

              return {
                ...post,
                _id: post._id || `post-${i}`,
                imageUrl,
                company: company || { _id: companyId, businessName: "Unknown Business", name: "Unknown Business", username: "unknown_business", logoUrl: null },
                likesCount: post.likesCount || 0,
                commentsCount: post.commentsCount || 0,
                isLiked: isLiked,
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0
              };
            })
          );
          fetchedRawPosts = processed;
        } else {
          throw new Error("Invalid API response format");
        }
      }

      // Deduplicate fetchedRawPosts by _id to guarantee no repetition of posts in any manner
      const uniquePostsMap = new Map<string, Post>();
      fetchedRawPosts.forEach(post => {
        if (post._id) uniquePostsMap.set(post._id, post);
      });
      const uniqueRawPosts = Array.from(uniquePostsMap.values());

      // Filter Seen Posts and Shuffle (Random Mode) with No Repetition
      const seenIdsJson = localStorage.getItem("zooda_seen_post_ids");
      const seenIds: string[] = seenIdsJson ? JSON.parse(seenIdsJson) : [];
      
      const unseenPosts = uniqueRawPosts.filter(post => !seenIds.includes(post._id!));
      
      if (fetchedRawPosts.length > 0 && unseenPosts.length === 0) {
        setAllCaughtUp(true);
        setPosts([]);
      } else {
        const shuffle = (array: Post[]) => {
          const arr = [...array];
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr;
        };
        setPosts(shuffle(unseenPosts));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [user?._id, activeTab]);

  const handleLoginRequest = () => setShowLoginModal(true);
  
  const handleLoginSuccess = (userData: User) => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    if (userData._id) fetchPosts();
  };

  const handleLike = async (postId: string, postIndex: number) => {
    if (!user?._id) return;
    try {
      const updatedPosts = [...posts];
      const post = updatedPosts[postIndex];
      const newLikeStatus = !post.isLiked;
      const newLikesCount = newLikeStatus ? (post.likesCount || 0) + 1 : (post.likesCount || 0) - 1;

      updatedPosts[postIndex] = {
        ...post,
        isLiked: newLikeStatus,
        likesCount: newLikesCount,
        likes: newLikesCount
      };
      setPosts(updatedPosts);

      const response = await axios.post(`https://zooda.vercel.app/api/post/${postId}/like`, { userId: user._id });

      if (response.data.success) {
        const finalUpdatedPosts = [...posts];
        finalUpdatedPosts[postIndex] = {
          ...finalUpdatedPosts[postIndex],
          isLiked: response.data.isLiked,
          likesCount: response.data.likesCount,
          likes: response.data.likesCount
        };
        setPosts(finalUpdatedPosts);
      } else {
        const revertedPosts = [...posts];
        revertedPosts[postIndex] = {
          ...revertedPosts[postIndex],
          isLiked: !revertedPosts[postIndex].isLiked,
          likesCount: revertedPosts[postIndex].isLiked ? (revertedPosts[postIndex].likesCount || 0) - 1 : (revertedPosts[postIndex].likesCount || 0) + 1,
          likes: revertedPosts[postIndex].isLiked ? (revertedPosts[postIndex].likes || 0) - 1 : (revertedPosts[postIndex].likes || 0) + 1
        };
        setPosts(revertedPosts);
        alert(response.data.message || "Failed to like post");
      }
    } catch (err: any) {
      const revertedPosts = [...posts];
      const currentPost = revertedPosts[postIndex];
      const currentLikesCount = currentPost.likesCount || 0;
      const currentIsLiked = currentPost.isLiked;
      revertedPosts[postIndex] = {
        ...currentPost,
        isLiked: !currentIsLiked,
        likesCount: currentIsLiked ? currentLikesCount - 1 : currentLikesCount + 1,
        likes: currentIsLiked ? currentLikesCount - 1 : currentLikesCount + 1
      };
      setPosts(revertedPosts);
      alert(err.response?.data?.message || "Failed to like post");
    }
  };

  const handleComment = async (postId: string, postIndex: number, commentText: string) => {
    if (!user?._id) return { success: false, error: "Please login to comment" };
    if (!commentText.trim()) return { success: false, error: "Comment cannot be empty" };

    try {
      const response = await axios.post(`https://zooda.vercel.app/api/post/${postId}/comment`, {
        text: commentText,
        userId: user._id,
      });

      if (response.data.success) {
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = {
          ...updatedPosts[postIndex],
          commentsCount: response.data.commentsCount,
          comments: response.data.commentsCount
        };
        setPosts(updatedPosts);
        return { success: true, comment: response.data.comment, commentsCount: response.data.commentsCount };
      } else {
        return { success: false, error: response.data.message || "Failed to post comment" };
      }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || err.message || "Failed to post comment" };
    }
  };

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post',
          text: post.content || 'Interesting post',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const refreshPosts = useCallback(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => { fetchPosts(); }, [fetchPosts, activeTab]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !posts.length) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute("data-post-id");
            if (postId) {
              const seenIdsJson = localStorage.getItem("zooda_seen_post_ids");
              const seenIds: string[] = seenIdsJson ? JSON.parse(seenIdsJson) : [];
              if (!seenIds.includes(postId)) {
                seenIds.push(postId);
                localStorage.setItem("zooda_seen_post_ids", JSON.stringify(seenIds));
                console.log("Post marked as seen in reels observer:", postId);
              }
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const cards = document.querySelectorAll(".instagram-reel-card");
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, [posts]);



  if (error)
    return (
      <div className="app-center app-error">
        <p>âš ï¸ {error}</p>
        <button onClick={refreshPosts} className="retry-btn">
          Retry
        </button>
      </div>
    );

  return (
    <>
      <main className="all-posts-page" style={{ background: '#000', height: '100%', minHeight: '0', display: 'flex', flexDirection: 'column' }}>
        <div className="tabs-container" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>
          <div className="tabs">
            {user?._id ? (
              <>
                <button
                  className={`tab ${activeTab === "Following" ? "active" : ""}`}
                  onClick={() => setActiveTab("Following")}
                >
                  Following
                </button>
                <button
                  className={`tab ${activeTab === "Unfollowing" ? "active" : ""}`}
                  onClick={() => setActiveTab("Unfollowing")}
                >
                  Unfollowing
                </button>
              </>
            ) : (
              <button className="tab active">
                Discover All Posts
              </button>
            )}
          </div>
          <button 
            onClick={refreshPosts} 
            className="refresh-btn"
            style={{
              position: 'absolute',
              right: '20px',
              top: '10px',
              background: 'transparent',
              border: 'none',
              color: '#15A148',
              cursor: 'pointer'
            }}
          >
            <span className="material-icons">refresh</span>
          </button>
        </div>

        {loading ? (
          <PostsDialoguePreloader />
        ) : allCaughtUp ? (
          <div className="no-posts flex flex-col items-center justify-center p-8 text-center" style={{ flex: 1, background: '#000', display: 'flex', flexDirection: 'column', alignSelf: 'center', margin: 'auto' }}>
            <span className="material-icons text-5xl text-[#15A148] mb-4 animate-bounce">check_circle</span>
            <h2 className="text-xl font-bold text-white mb-2">You're All Caught Up!</h2>
            <p className="text-xs text-zinc-400 max-w-sm mb-6">You've seen all available posts in this feed. Clear your viewing history to browse them again.</p>
            <button 
              onClick={() => {
                localStorage.removeItem("zooda_seen_post_ids");
                refreshPosts();
              }}
              className="px-6 py-2.5 rounded-full bg-[#15A148] hover:bg-[#0f8a3a] text-white font-bold text-xs transition hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Reset Viewing History
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No posts found</div>
        ) : (
          <div className="instagram-reels-container">
            {posts.map((post, postIndex) => {
              const companyName = post.company?.businessName || post.company?.name || "Business Name";
              const lowercaseName = companyName.toLowerCase().replace(/[\s.]/g, "");
              const rawWebsite = post.websiteUrl || post.company?.siteUrl || post.company?.businessWebsite || post.company?.website || "#";
              const websiteUrl = getFormattedUrl(rawWebsite);
              const isPostLiked = post.isLiked || false;
              const isExpanded = !!expandedPosts[post._id!];
              const fullText = (post.content && post.content.trim()) || (post.caption && post.caption.trim()) || "Welcome to our business showcase. Click 'Visit Site' to explore our premium updates and services!";

              return (
                <div
                  key={post._id}
                  data-post-id={post._id}
                  className="instagram-reel-card"
                  onClick={() => onSelectPost(post, post.company)}
                >
                  {/* Media wrapper */}
                  <div className="reel-media-wrapper w-full h-full">
                    {post.mediaType === 'video' || 
                     (post.mediaUrl && (post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.webm') || post.mediaUrl.endsWith('.mov') || post.mediaUrl.includes('video/upload'))) ||
                     (post.imageUrl && (post.imageUrl.endsWith('.mp4') || post.imageUrl.endsWith('.webm') || post.imageUrl.endsWith('.mov') || post.imageUrl.includes('video/upload'))) ? (
                      <video
                        src={post.mediaUrl && !post.mediaUrl.startsWith("http") ? `https://zooda.vercel.app${post.mediaUrl.startsWith("/") ? "" : "/"}${post.mediaUrl}` : (post.mediaUrl || post.imageUrl)}
                        className="reel-video w-full h-full object-contain"
                        controls
                        loop
                        muted
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={post.imageUrl}
                        alt="Reel content"
                        className="reel-image w-full h-full object-contain"
                        onError={(e) => (e.currentTarget.src = `https://picsum.photos/600/1000?random=${post._id}`)}
                      />
                    )}
                  </div>

                  {/* Desktop & Mobile Overlay Panel */}
                  <div className="reel-mobile-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className="reel-info-left">
                      {/* Logo, username, follow button, visit site button */}
                      <div className="reels-profile-row">
                        {post.company?.logoUrl ? (
                          <img
                            src={post.company.logoUrl}
                            alt={companyName}
                            className="profile-logo"
                          />
                        ) : (
                          <div className="profile-logo-fallback">
                            {companyName.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className="username-label">@{lowercaseName}</span>
                        
                        {/* Follow Button */}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!user?._id) {
                              handleLoginRequest();
                              return;
                            }
                            try {
                              await axios.post(`https://zooda.vercel.app/api/follow/${post.company?._id}`, { userId: user._id });
                              refreshPosts();
                            } catch (err) {
                              console.error("Error following in reels:", err);
                            }
                          }}
                          className="follow-btn"
                        >
                          {post.company?.followersList?.includes(user?._id || "") ? "Following" : "Follow"}
                        </button>

                        {/* Visit Site Button */}
                        <a
                          href={websiteUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            if (websiteUrl !== "#" && post.company && onVisitSite) {
                              onVisitSite({
                                ...post.company,
                                siteUrl: websiteUrl
                              });
                            }
                          }}
                          className="visit-btn"
                        >
                          Visit Site
                        </a>
                      </div>

                      {/* Post description (One line expandable description with more/less toggle) */}
                      <p className={`reel-description ${isExpanded ? "expanded" : "collapsed"}`}>
                        <span className="font-bold mr-1.5 desc-username">@{lowercaseName}</span>
                        <span className="description-text">
                          {isExpanded ? fullText : (fullText.length > 60 ? `${fullText.substring(0, 56)}...` : fullText)}
                        </span>
                        {fullText.length > 60 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPosts(prev => ({ ...prev, [post._id!]: !isExpanded }));
                            }}
                            className="more-toggle-btn"
                            type="button"
                          >
                            {isExpanded ? "less" : "more"}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Floating Action sidebar right */}
                  <div className="reel-interaction-sidebar" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user?._id) {
                          handleLoginRequest();
                          return;
                        }
                        handleLike(post._id!, postIndex);
                      }}
                      className="reel-sidebar-btn group"
                    >
                      <div className="btn-glow-circle">
                        <span className={`material-icons text-xl transition-all duration-200 ${isPostLiked ? 'text-red-500 scale-110' : 'text-black group-hover:text-white'}`}>
                          {isPostLiked ? 'favorite' : 'favorite_border'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-white">{post.likesCount || 0}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCommentsPost({ post, company: post.company });
                      }}
                      className="reel-sidebar-btn group"
                    >
                      <div className="btn-glow-circle">
                        <span className="material-icons text-xl text-black group-hover:text-white transition-all duration-200">chat_bubble_outline</span>
                      </div>
                      <span className="text-[10px] font-bold text-white">{post.commentsCount || 0}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post);
                      }}
                      className="reel-sidebar-btn group"
                    >
                      <div className="btn-glow-circle">
                        <span className="material-icons text-xl text-black group-hover:text-white transition-all duration-200">send</span>
                      </div>
                      <span className="text-[10px] font-bold text-white">Share</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
        onOpenRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleLoginSuccess}
        onOpenLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      {activeCommentsPost && (
        <InstagramPostModal
          isOpen={!!activeCommentsPost}
          onClose={() => setActiveCommentsPost(null)}
          post={activeCommentsPost.post}
          company={activeCommentsPost.company}
          postsList={posts}
          onLike={(id) => handleLike(id, posts.findIndex(p => p._id === id))}
          onComment={(id, text) => handleComment(id, posts.findIndex(p => p._id === id), text)}
          onShare={handleShare}
          user={user}
          onLoginRequest={onLoginRequest}
          navigate={(path) => {
            const cleanPath = path.startsWith("/") ? path : "/" + path;
            window.history.pushState(null, "", cleanPath);
          }}
        />
      )}
    </>
  );
};


interface PostGridItemProps {
  post: Post;
  postIndex: number;
  onSelectPost: (post: Post) => void;
  onLike: (postId: string, postIndex: number) => void;
  onComment: (postId: string, postIndex: number, commentText: string) => Promise<{success: boolean; error?: string}>;
  onShare: (post: Post) => void;
  user?: User;
  onLoginRequest?: () => void;
  onRefreshPosts?: () => void;
}

const PostGridItem = ({ 
  post, 
  postIndex, 
  onSelectPost, 
  onLike, 
  onComment,
  onShare, 
  user,
  onLoginRequest,
  onRefreshPosts
}: PostGridItemProps) => {
  const companyName = post.company?.businessName || post.company?.name || "Business Name";
  const companyUsername = post.company?.username || companyName.toLowerCase().replace(/[\s.]/g, "_");

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [actionError, setActionError] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const formattedDate = new Date(
    post.createdAt || post.date
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const toggleComments = async () => {
    if (!user?._id) {
      setActionError("Please login to view comments");
      return;
    }

    if (!showComments && post._id) {
      setIsLoadingComments(true);
      try {
        console.log('Fetching comments for post:', post._id);
        const response = await axios.get(
          `https://zooda.vercel.app/api/post/${post._id}/comments`
        );
        console.log('Comments response:', response.data);
        
        if (response.data.success !== false) {
          setPostComments(response.data.comments || []);
        } else {
          setActionError(response.data.message || "Failed to load comments");
        }
      } catch (err) {
        console.error("Error loading comments:", err);
        setActionError("Failed to load comments");
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments(!showComments);
    setActionError("");
  };

  const handleLikeWithLoginCheck = () => {
    if (!user?._id) {
      setActionError("Please login to like posts");
      return;
    }
    setActionError("");
    onLike(post._id, postIndex);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post._id) return;

    setIsSubmittingComment(true);
    setActionError("");
    try {
      const result = await onComment(post._id, postIndex, commentText);
      if (result.success) {
        setCommentText("");
        // Refresh comments after successful comment
        try {
          const response = await axios.get(
            `https://zooda.vercel.app/api/post/${post._id}/comments`
          );
          if (response.data.success !== false) {
            setPostComments(response.data.comments || []);
          }
        } catch (err) {
          console.error("Error refreshing comments:", err);
        }
        
        // Refresh posts to update comment count globally
        if (onRefreshPosts) {
          setTimeout(() => onRefreshPosts(), 500);
        }
      } else if (result.error) {
        setActionError(result.error);
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setActionError("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShareWithLoginCheck = () => {
    onShare(post);
  };

  // Use the correct field names from your schema
  const likesCount = post.likesCount || 0;
  const commentsCount = post.commentsCount || 0;

  return (
    <article className="post-grid-item">
      {/* Header with Business Info and Logo */}
      <div className="post-header">
        <div className="business-info">
          <div className="business-avatar">
            {post.company?.logoUrl ? (
              <img 
                src={post.company.logoUrl} 
                alt={companyName}
                className="business-logo"
              />
            ) : (
              <div className="business-avatar-fallback">
                {companyName.charAt(0)}
              </div>
            )}
          </div>
          <div className="business-details">
            <strong className="business-name">
              {companyName}
            </strong>
            <span className="business-username">@{companyUsername}</span>
          </div>
        </div>
        {/* Show stats in header */}
       
      </div>

      {/* Post Image */}
      <div 
        className="post-image-container"
        onClick={() => onSelectPost(post)}
      >
        <img
          src={post.imageUrl}
          alt={post.content || "Post image"}
          className="post-image"
          onError={(e) => {
            console.error('Image failed to load:', post.imageUrl);
            e.currentTarget.src = `https://picsum.photos/600/400?random=${postIndex}`;
          }}
        />
      </div>

      {/* Action Error Message */}
      {actionError && (
        <div className="action-error">
          <span>{actionError}</span>
          {onLoginRequest && (
            <button 
              onClick={onLoginRequest}
              className="login-link-btn"
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Engagement Section */}
      <div className="post-engagement">
        <div className="engagement-left">
          <button
            className={`like-btn ${post.isLiked ? 'liked' : ''}`}
            onClick={handleLikeWithLoginCheck}
            title={post.isLiked ? "Unlike" : "Like"}
          >
            <span className="material-icons">
              {post.isLiked ? "favorite" : "favorite_border"}
            </span>
          </button>
          <button 
            className="comment-btn"
            onClick={toggleComments}
            title="Comment"
          >
            <span className="material-icons">chat_bubble_outline</span>
          </button>
          <button 
            className="share-btn"
            onClick={handleShareWithLoginCheck}
            title="Share"
          >
            <span className="material-icons">send</span>
          </button>
        </div>
      </div>

      {/* Post Stats and Content */}
      <div className="post-content">
        {likesCount > 0 && (
          <div className="post-stats">
            <strong>{likesCount.toLocaleString()} likes</strong>
          </div>
        )}

        <div className="post-caption">
          <strong className="username">@{companyUsername}</strong> 
          <span className="caption-text">{post.content || post.caption}</span>
        </div>

        {commentsCount > 0 && (
          <button 
            className="view-comments"
            onClick={toggleComments}
            disabled={isLoadingComments}
          >
            {isLoadingComments ? "Loading comments..." : `View all ${commentsCount} comments`}
          </button>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="comments-section">
            {!user?._id ? (
              <div className="login-prompt-comments">
                <p>Please login to view and post comments</p>
                {onLoginRequest && (
                  <button 
                    onClick={onLoginRequest}
                    className="login-btn-small"
                  >
                    Login
                  </button>
                )}
              </div>
            ) : (
              <>
                {isLoadingComments ? (
                  <div className="loading-comments">Loading comments...</div>
                ) : (
                  <>
                    {postComments.length === 0 ? (
                      <div className="no-comments">No comments yet</div>
                    ) : (
                      postComments.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <strong className="comment-username">
                            {comment.userId?.name }
                          </strong>
                          <span className="comment-text">{comment.text}</span>
                        </div>
                      ))
                    )}
                    
                    {/* Comment Input */}
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="comment-input"
                        disabled={isSubmittingComment || !user?._id}
                      />
                      <button
                        type="submit"
                        className="comment-submit-btn"
                        disabled={!commentText.trim() || isSubmittingComment || !user?._id}
                      >
                        {isSubmittingComment ? 'Posting...' : 'Post'}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        )}

        <div className="post-date">{formattedDate}</div>
      </div>
    </article>
  );
};



const styles = `
/* Login Prompt Styles */
.login-prompt {
  text-align: center;
  padding: 2rem;
}

.login-prompt-content h2 {
  margin-bottom: 1rem;
  color: #333;
}

.login-prompt-content p {
  margin-bottom: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.login-btn-primary {
  background: #0095f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
}

.login-btn-primary:hover {
  background: #0081d6;
}

.login-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
}

.feature .material-icons {
  color: #0095f6;
}

/* Action Error Styles */
.action-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 8px 12px;
  margin: 8px 0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.login-link-btn {
  background: none;
  border: 1px solid #856404;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.login-link-btn:hover {
  background: #856404;
  color: white;
}

/* Comments Login Prompt */
.login-prompt-comments {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.login-btn-small {
  background: #0095f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.login-btn-small:hover {
  background: #0081d6;
}
.all-posts-page {
  max-width: 614px;
  margin: 0 auto;
  padding: 20px 0;
  background: #000000;
  min-height: 100vh;
}

.posts-feed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-grid-item {
  background: #000000;
  border: 1px solid #363636;
  border-radius: 8px;
  overflow: hidden;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #000000;
}

.business-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.business-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #15A148;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  overflow: hidden;
  position: relative;
}

.business-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.business-details {
  display: flex;
  flex-direction: column;
}

.business-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.business-username {
  font-size: 12px;
  color: #a8a8a8;
}

.post-image-container {
  cursor: pointer;
  background: #000000;
}

.post-image {
  width: 100%;
  height: 500px;
  object-fit: fill;
 
}

.post-engagement {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #000000;
}

.engagement-left {
  display: flex;
  gap: 4px;
}

.like-btn, .comment-btn, .share-btn, .bookmark-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #ffffff;
}

.like-btn.liked .material-icons {
  color: #ed4956;
}

.material-icons {
  font-size: 24px;
  color: #ffffff;
  transition: transform 0.2s ease;
}

.material-icons:hover {
  transform: scale(1.1);
}

.post-content {
  padding: 0 16px 16px;
  background: #000000;
}

.post-stats {
  margin-bottom: 8px;
}

.post-stats strong {
  font-size: 14px;
  color: #ffffff;
}

.post-caption {
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.4;
  color: #ffffff;
}

.username {
  color: #ffffff;
  font-weight: 600;
  margin-right: 6px;
}

.caption-text {
  color: #ffffff;
}

.view-comments {
  background: none;
  border: none;
  color: #a8a8a8;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 8px;
  transition: color 0.2s ease;
}

.view-comments:hover {
  color: #ffffff;
}

/* Comments Section */
.comments-section {
  margin: 12px 0;
  border-top: 1px solid #363636;
  padding-top: 12px;
}

.comment-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.comment-username {
  color: #ffffff;
  font-weight: 600;
}

.comment-text {
  color: #ffffff;
}

.comment-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.comment-input {
  flex: 1;
  background: #000000;
  border: 1px solid #363636;
  border-radius: 4px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
}

.comment-input::placeholder {
  color: #a8a8a8;
}

.comment-input:focus {
  outline: none;
  border-color: #0095f6;
}

.comment-submit-btn {
  background: #0095f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.comment-submit-btn:disabled {
  background: #363636;
  color: #a8a8a8;
  cursor: not-allowed;
}

.comment-submit-btn:not(:disabled):hover {
  opacity: 0.8;
}

.post-date {
  font-size: 10px;
  color: #a8a8a8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
}

/* Tabs */
.tabs-container {
  border-bottom: 1px solid #363636;
  margin-bottom: 20px;
  background: #000000;
}

.tabs {
  display: flex;
  max-width: 614px;
  margin: 0 auto;
  background: #000000;
}

.tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #a8a8a8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  background: #000000;
}

.tab.active {
  color: #ffffff;
  border-bottom-color: #ffffff;
}

.tab:hover {
  color: #ffffff;
  background: #121212;
}

@media (max-width: 768px) {
  .tab {
    padding: 6px 8px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-align: center;
  }
}


.no-posts {
  text-align: center;
  padding: 40px;
  color: #a8a8a8;
  background: #000000;
}

.app-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  background: #000000;
}

.text-default {
  color: #ffffff;
}

.app-error {
  flex-direction: column;
  gap: 12px;
  background: #000000;
}

.app-error p {
  color: #ffffff;
}

.retry-btn {
  padding: 8px 16px;
  background: green;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

/* Global body background */
body {
  background: #ffffff !important;
  color: #0f172a !important;
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #363636;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}
  @media (max-width: 480px) {
    
    .post-image {
      height: auto;
      }
`;

// Add this style to your document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
// ---------------- POST DETAIL PAGE ----------------
interface PostDetailPageProps {
  data: { post: Post; company: Company };
  onBack: () => void;
  user?: User;
  onLoginRequest?: () => void;
}

const PostDetailPage = ({ data, onBack, user, onLoginRequest }: PostDetailPageProps) => {
  const [post, setPost] = useState<Post>(data.post);
  const [company, setCompany] = useState<Company>(data.company);
  const [loading, setLoading] = useState(true);
  const [companyPosts, setCompanyPosts] = useState<Post[]>([]);

  // Fetch complete details of the post first
  const fetchPostDetails = useCallback(async (postId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/post/${postId}/details`);
      if (response.data.success) {
        const fetchedPost = response.data.post;
        setPost(fetchedPost);
        
        // Fetch company details if incomplete
        let fetchedCompany = company;
        const busId = fetchedPost.businessId || (fetchedPost.business && fetchedPost.business._id) || fetchedPost.business;
        if (busId && busId !== "unknown" && (!company._id || company._id === "unknown")) {
          const companyResponse = await axios.get(`${API_BASE_URL}/api/companies/${busId}`);
          if (companyResponse.data.success) {
            fetchedCompany = companyResponse.data.company;
            setCompany(fetchedCompany);
          }
        }

        // Fetch sibling posts of this business to enable next/previous navigation
        if (busId && busId !== "unknown") {
          const postsRes = await axios.get(`${API_BASE_URL}/api/post/${busId}`);
          if (postsRes.data.success) {
            setCompanyPosts(postsRes.data.posts || []);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching post details:", err);
    } finally {
      setLoading(false);
    }
  }, [company]);

  useEffect(() => {
    if (data.post && data.post._id) {
      fetchPostDetails(data.post._id);
    }
  }, [data.post._id]);

  // Sibling likes/comments syncing
  const handleLike = async (postId: string) => {
    if (!user?._id) return;
    try {
      await axios.post(`${API_BASE_URL}/api/post/${postId}/like`, { userId: user._id });
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId: string, text: string) => {
    if (!user?._id) return { success: false, error: "Please login" };
    try {
      const res = await axios.post(`${API_BASE_URL}/api/post/${postId}/comment`, {
        userId: user._id,
        userName: user.name || "User",
        text: text
      });
      return { success: res.data.success };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleShare = async (p: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Zooda Post",
          text: p.content,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  if (loading) {
    return (
      <div className="post-detail-page flex items-center justify-center h-[80vh] bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-green-500" size={32} />
          <p className="text-zinc-400 text-sm">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page bg-zinc-950 min-h-[90vh]">
      <InstagramPostModal
        isOpen={true}
        onClose={onBack}
        post={post}
        company={company}
        postsList={companyPosts}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        user={user}
        onLoginRequest={onLoginRequest}
        navigate={(path) => {
          // When navigate is called from within the modal (next/prev),
          // we update the URL pathing and fetch the next post's full details!
          const cleanPath = path.startsWith("/") ? path : "/" + path;
          window.history.pushState(null, "", cleanPath);
          window.dispatchEvent(new Event("popstate"));
        }}
      />
    </div>
  );
};

interface ProfilePageProps {
  company: Company;
  onSelectPost: (post: Post, company: Company) => void;
  user?: User;
  onLoginRequest?: () => void;
  onVisitSite?: (company: Company) => void;
}

export const ProfilePage = ({
  company,
  onSelectPost,
  user,
  onLoginRequest,
  onVisitSite,
}: ProfilePageProps) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<"Posts" | "Products" | "AI Chat">("Posts");

  // Filter states
  const [activePostCategory, setActivePostCategory] = useState("All");
  const [activeProductTag, setActiveProductTag] = useState("All");

  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Follow states
  const [followers, setFollowers] = useState<number>(parseInt(company.followers) || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Post detail states
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showPostsGrid, setShowPostsGrid] = useState(false);

  // Filter options
  const [postCategories, setPostCategories] = useState<string[]>(["All"]);
  const [productTags, setProductTags] = useState<string[]>(["All"]);

  // AI chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showAiChatModal, setShowAiChatModal] = useState(false);

  const handleAiChatClick = () => {
    setShowAiChatModal(true);
  };

  // Fallback: fetch botId if not provided in company prop
  const [fetchedBotId, setFetchedBotId] = useState<string | null>(company.botId || null);
  const [fetchingBot, setFetchingBot] = useState(false);

  // Fetch botId if missing
  useEffect(() => {
    const getBotId = async () => {
      if (company.botId) {
        setFetchedBotId(company.botId);
        return;
      }
      setFetchingBot(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/business/${company._id}`);
        if (res.data.business?.botId) {
          setFetchedBotId(res.data.business.botId);
        }
      } catch (err) {
        console.error("Failed to fetch business botId:", err);
      } finally {
        setFetchingBot(false);
      }
    };
    getBotId();
  }, [company._id, company.botId]);

  // Reset follow state when user logs out
  useEffect(() => {
    if (!user) {
      setIsFollowing(false);
      setFollowers(parseInt(company.followers) || 0);
    }
  }, [user, company.followers]);

  // Check follow status when user logs in
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/follow/${company._id}/status/${user._id}`
        );
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };
    checkFollowStatus();
  }, [user?._id, company._id]);

  // Fetch posts and products
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        const [postsRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/post/${company._id}`),
          fetch(`${API_BASE_URL}/api/product/${company._id}`),
        ]);

        if (!postsRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const postsData = await postsRes.json();
        const productsData = await productsRes.json();

        const fetchedPosts = postsData.posts || [];

        let processedPosts = fetchedPosts.map((post: Post) => ({
          ...post,
          _id: post._id || `post-${Math.random()}`,
          imageUrl:
            post.mediaUrl ||
            post.imageUrl ||
            `https://picsum.photos/600/400?random=${post._id}`,
          mediaUrl: post.mediaUrl || post.imageUrl,
          likes: post.likes || 0,
          comments: post.comments || 0,
          company: {
            _id: company._id,
            name: company.name,
            username: company.name.toLowerCase().replace(/[\s.]/g, "_"),
            logoUrl: company.logoUrl,
          },
        }));

        let productArray = productsData.products || [];

        // Dynamic local memory persistence scoped to this business profile
        try {
          const clientBusStr = localStorage.getItem("zooda_client_business");
          const clientBus = clientBusStr ? JSON.parse(clientBusStr) : null;
          // Sync if business names match OR if this is the active client business profile
          if (clientBus && (clientBus.businessName === company.name || (company.name === "Your Business" && !clientBus.businessName))) {
            const localPostsStr = localStorage.getItem("zooda_client_posts");
            if (localPostsStr) {
              const localPosts = JSON.parse(localPostsStr).map((p: any) => ({
                ...p,
                _id: p._id || `local-post-${Math.random()}`,
                imageUrl: p.imageUrl || `https://picsum.photos/600/400?random=${Math.random()}`,
                likes: p.likes || 0,
                comments: p.comments || 0,
                category: p.category || "General",
                company: {
                  _id: company._id,
                  name: company.name,
                  username: company.name.toLowerCase().replace(/[\s.]/g, "_"),
                  logoUrl: company.logoUrl,
                }
              }));
              // Merge local posts first so they appear at the top!
              processedPosts = [...localPosts, ...processedPosts.filter((p: any) => !localPosts.some((lp: any) => lp.title === p.title))];
            }

            const localProductsStr = localStorage.getItem("zooda_client_products");
            if (localProductsStr) {
              const localProducts = JSON.parse(localProductsStr).map((p: any) => ({
                ...p,
                _id: p._id || `local-product-${Math.random()}`,
                imageUrl: p.imageUrl || `https://picsum.photos/600/400?random=${Math.random()}`,
                price: p.price || "0",
                tags: p.tags || [p.category || "General"],
                name: p.title
              }));
              productArray = [...localProducts, ...productArray.filter((p: any) => !localProducts.some((lp: any) => lp.name === p.name))];
            }
          }
        } catch (e) {
          console.error("Failed to sync client memory in User Portal:", e);
        }

        setPosts(processedPosts);
        setProducts(productArray);

        // Extract unique tags for filtering
        const uniqueTags = [
          "All",
          ...new Set(
            productArray
              .flatMap((p: Product) => p.tags || [])
              .map((t: string) => t.trim())
              .filter((t: string) => t.length > 0)
          ),
        ];
        setProductTags(uniqueTags);

        // Extract unique categories for filtering
        const uniqueCategories = [
          "All",
          ...new Set(
            processedPosts
              .map((p: Post) => p.category)
              .filter((c: string) => c && c.trim().length > 0)
          ),
        ];
        setPostCategories(uniqueCategories);

        setError("");
      } catch (err) {
        console.error(err);
        setError("Error fetching company content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [company._id]);

  // Clear messages when user logs out
  useEffect(() => {
    if (!user) {
      setChatMessages([]);
    }
  }, [user]);

  // Fetch chat history when the AI Chat modal is opened
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!showAiChatModal || !company._id) return;

      let token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        let guestId = localStorage.getItem('zooda_guest_user_id');
        if (!guestId) {
          const chars = "0123456789abcdef";
          let tempId = "";
          for (let i = 0; i < 24; i++) {
            tempId += chars[Math.floor(Math.random() * 16)];
          }
          guestId = tempId;
          localStorage.setItem('zooda_guest_user_id', guestId);
        }
        token = `guest_${guestId}`;
      }

      setLoadingHistory(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/chat/history?businessId=${company._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const history = res.data.messages || [];

        if (history.length > 0) {
          setChatMessages(history);
        } else {
          setChatMessages([{
            role: "ai",
            text: `Hi! Ask anything about ${company.name}, products, or posts.`
          }]);
        }
      } catch (err: any) {
        console.error("Failed to load chat history:", err);
        if (err.response?.status === 401 && !token.startsWith("guest_")) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          onLoginRequest?.();
          setChatMessages([{ role: "ai", text: "Your session expired. Please log in again." }]);
        } else {
          setChatMessages([{
            role: "ai",
            text: `Hi! Ask anything about ${company.name}, products, or posts.`
          }]);
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, [showAiChatModal, company._id, user?._id, onLoginRequest]);

  // Follow handler
  const handleFollow = async () => {
    if (!user?._id) {
      onLoginRequest?.();
      return;
    }

    setFollowLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/follow/${company._id}`, {
        userId: user._id,
      });

      if (res.data.success) {
        setFollowers(res.data.followers);
        setIsFollowing(res.data.isFollowing);
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Post click handler
  const handlePostImageClick = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
    setShowPostsGrid(true);
    window.history.pushState(null, "", `/${getPostUrl(post)}`);
  };

  const handleClosePostDetail = () => {
    setShowPostDetail(false);
    setShowPostsGrid(false);
    setSelectedPost(null);
    const companySlug = slugify(company.name || company.businessName || "business");
    window.history.pushState(null, "", `/${companySlug}`);
  };

  // Like handler
  const handleLike = async (postId: string, postIndex: number) => {
    if (!user?._id) return;

    try {
      const updatedPosts = [...posts];
      const post = updatedPosts[postIndex];

      const newLike = !post.isLiked;
      post.isLiked = newLike;
      post.likes += newLike ? 1 : -1;

      setPosts(updatedPosts);

      await axios.post(`${API_BASE_URL}/api/post/${postId}/like`, {
        userId: user._id,
      });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Comment handler
  const handleComment = async (postId: string, postIndex: number, commentText: string) => {
    if (!user?._id) {
      return { success: false, error: "Please login to comment" };
    }

    if (!commentText.trim()) {
      return { success: false, error: "Comment cannot be empty" };
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/post/${postId}/comment`, {
        text: commentText,
        userId: user._id,
      });

      const updated = [...posts];
      updated[postIndex].comments = res.data.commentsCount;
      setPosts(updated);

      return { success: true };
    } catch (err) {
      console.error("Comment error:", err);
      return { success: false };
    }
  };

  // Share handler
  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post",
          text: post.content,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  // Send chat message (with token)
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user" as const, text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const botId = fetchedBotId || company.botId;
      if (!botId) {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", text: "This business hasn't set up an AI chatbot yet." },
        ]);
        setChatLoading(false);
        return;
      }

      let token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        let guestId = localStorage.getItem('zooda_guest_user_id');
        if (!guestId) {
          const chars = "0123456789abcdef";
          let tempId = "";
          for (let i = 0; i < 24; i++) {
            tempId += chars[Math.floor(Math.random() * 16)];
          }
          guestId = tempId;
          localStorage.setItem('zooda_guest_user_id', guestId);
        }
        token = `guest_${guestId}`;
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/chat`,
        {
          botId,
          question: chatInput,
          businessId: company._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.answer,
        },
      ]);
    } catch (err: any) {
      console.error("AI chat error:", err);
      let errorMessage = "Something went wrong while contacting AI.";

      if (err.response?.status === 401) {
        errorMessage = "Your session expired. Please log in again.";
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        onLoginRequest?.();
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtered lists
  const filteredPosts =
    activePostCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activePostCategory);

  const filteredProducts =
    activeProductTag === "All"
      ? products
      : products.filter((p) =>
          (p.tags || [])
            .map((t) => t.toLowerCase())
            .includes(activeProductTag.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-white text-slate-800 animate-fade-in">
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Compact Profile Card */}
        <section 
          className="relative w-full rounded-2xl border p-4 flex flex-col gap-3 overflow-hidden"
          style={{
            background: "#f8fafc",
            borderColor: "#e2e8f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
          }}
        >
          {/* Top Row: Logo + Info + Buttons */}
          <div className="flex items-start gap-4 w-full">
            {/* Logo */}
            <div 
              className="relative p-1 rounded-full flex-shrink-0"
              style={{
                background: "#15A148",
                boxShadow: "0 2px 8px rgba(21, 161, 72, 0.15)"
              }}
            >
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} Logo`}
                  className="h-14 w-14 rounded-full object-contain bg-white p-1 border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-[#15A148] flex items-center justify-center font-black text-lg text-white">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name + Category + Description */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-800 leading-tight truncate">
                {company.name}
              </h2>
              <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#15A148]/10 text-[#15A148] border border-[#15A148]/20 uppercase tracking-wider">
                {company.category || "SaaS & IoT"}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
                {company.description || "Welcome to our premium business profile."}
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 w-full">
            {company.isAiChatEnabled && (
              <button
                onClick={() => {
                  localStorage.setItem("startChatWithBusinessId", company._id);
                  localStorage.setItem("startChatWithBusinessData", JSON.stringify({
                    _id: company._id,
                    businessName: company.name,
                    logoUrl: company.logoUrl,
                    businessCategory: company.category || "Local Business",
                    isAiChatEnabled: company.isAiChatEnabled
                  }));
                  window.history.pushState(null, "", "/chats");
                  window.dispatchEvent(new Event("popstate"));
                }}
                className="flex-1 h-9 rounded-lg bg-[#15A148] hover:bg-[#0f8a3a] text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Bot size={12} /> AI Chat
              </button>
            )}

            <button
              onClick={() => onVisitSite?.(company)}
              className="flex-1 h-9 rounded-lg bg-[#1b4fd8] hover:bg-[#123cb2] text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles size={12} className="text-white" /> Visit Site
            </button>

            <button
              onClick={handleFollow}
              disabled={followLoading}
              className="flex-1 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: isFollowing ? "#f1f5f9" : "#15A148",
                color: isFollowing ? "#1e293b" : "white",
                border: isFollowing ? "1px solid #e2e8f0" : "none",
              }}
            >
              {followLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto text-current" />
              ) : isFollowing ? (
                "Unfollow"
              ) : (
                "Follow"
              )}
            </button>
          </div>

          {/* Compact Stats Row */}
          <div 
            className="grid grid-cols-3 w-full text-center rounded-xl p-3 border border-slate-200"
            style={{ background: "#f1f5f9" }}
          >
            <div className="border-r border-slate-200 flex flex-col">
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {posts.length}
              </h4>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Posts
              </span>
            </div>
            <div className="border-r border-slate-200 flex flex-col">
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {products.length}
              </h4>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Products
              </span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-lg font-black text-[#15A148] leading-none">
                {followers}
              </h4>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Followers
              </span>
            </div>
          </div>
        </section>

        <nav className="mt-6 flex flex-wrap gap-3">
          {["Posts", "Products", "AI Chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === "AI Chat") {
                  handleAiChatClick();
                } else {
                  setActiveTab(tab as "Posts" | "Products" | "AI Chat");
                }
              }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#15A148] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {loading ? (
          <p className="mt-6 text-slate-500 font-medium">Loading...</p>
        ) : error ? (
          <p className="mt-6 text-red-500">{error}</p>
        ) : (
          <>

            {/* Posts Tab (Grid-Style image feed with horizontal category filter pills and 4-column layout) */}
            {activeTab === "Posts" && (
              <div className="mt-6 w-full">
                {/* Horizontal Category Pills */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {postCategories.map((category) => (
                    <button
                      key={category}
                      className={`rounded-full px-4 py-2 text-sm transition-all font-semibold ${
                        activePostCategory === category
                          ? "bg-[#15A148] text-white shadow-md shadow-green-600/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                      }`}
                      onClick={() => setActivePostCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Posts grid - exactly 4 posts in a row on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, postIndex) => (
                      <div
                        key={post._id}
                        className="aspect-square relative overflow-hidden rounded-xl group cursor-pointer border border-slate-200 bg-slate-50 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                        onClick={() => handlePostImageClick(post)}
                      >
                        <img
                          src={post.imageUrl}
                          alt={post.caption || "Post content"}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => (e.currentTarget.src = `https://picsum.photos/400/400?random=${post._id}`)}
                        />
                        {/* Hover overlay with likes and comments */}
                        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-4 text-black text-xs font-bold post-hover-overlay">
                          <span className="flex items-center gap-1">
                            <span className="material-icons text-black text-sm">favorite</span>
                            {post.likes || post.likesCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-icons text-black text-sm">chat_bubble</span>
                            {post.comments || post.commentsCount || 0}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 p-8 text-center col-span-full w-full font-medium">No posts yet.</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "Products" && (
              <div className="mt-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {productTags.map((tag) => (
                    <button
                      key={tag}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        activeProductTag === tag
                          ? "bg-[#15A148] text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                      }`}
                      onClick={() => setActiveProductTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:border-[#15A148]/30 hover:shadow-md"
                      >
                        <a
                          href={product.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="aspect-square overflow-hidden bg-white">
                            <img
                              src={product.image?.url || product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                              onError={(e) =>
                                (e.currentTarget.src = `https://picsum.photos/400/400?random=${product._id}`)
                              }
                            />
                          </div>
                        </a>

                        <div className="p-3">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm text-[#15A148] font-black">â‚¹{product.price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 p-8 text-center col-span-full w-full font-medium">No products yet.</p>
                  )}
                </section>
              </div>
            )}

            {/* AI Chat Modal Overlay */}
            {showAiChatModal && (
              <div 
                className="fixed inset-0 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4 backdrop-blur-sm"
                style={{ zIndex: 9999 }}
                onClick={() => setShowAiChatModal(false)}
              >
                <div 
                  className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col h-[75vh] sm:h-[550px] overflow-hidden animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button in top-right */}
                  <button 
                    type="button"
                    onClick={() => setShowAiChatModal(false)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center text-xl transition-all font-bold z-10"
                  >
                    &times;
                  </button>

                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 pr-16">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#15A148] animate-pulse"></span>
                      AI Chat with {company.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Ask about products, services, posts, or company details.
                    </p>
                    {fetchingBot && <p className="mt-1 text-[10px] text-slate-400">Loading chatbot info...</p>}
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                    {loadingHistory ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                        <div className="w-6 h-6 border-2 border-[#15A148] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">Loading conversation...</span>
                      </div>
                    ) : (
                      chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "ml-auto bg-[#15A148] text-white shadow-sm shadow-green-600/10"
                              : "mr-auto bg-white text-slate-800 border border-slate-200/80 shadow-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))
                    )}

                    {chatLoading && (
                      <div className="mr-auto rounded-2xl bg-white text-slate-500 border border-slate-200/80 px-4 py-3 text-sm shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-white pb-8 sm:pb-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                        placeholder={`Ask AI about ${company.name}...`}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#15A148] focus:bg-white focus:ring-1 focus:ring-[#15A148] transition-all text-slate-800"
                        disabled={chatLoading || loadingHistory}
                      />
                      <button
                        onClick={handleSendChat}
                        disabled={chatLoading || loadingHistory || fetchingBot || !chatInput.trim()}
                        className="rounded-xl bg-[#15A148] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f8a3a] disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-1 shadow-md shadow-green-600/10"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Detail Lightbox Modal Overlay */}
            {showPostDetail && selectedPost && (
              <InstagramPostModal
                isOpen={showPostDetail}
                onClose={handleClosePostDetail}
                post={selectedPost}
                company={company}
                postsList={posts}
                onLike={(id) => handleLike(id, posts.findIndex(p => p._id === id))}
                onComment={(id, text) => handleComment(id, posts.findIndex(p => p._id === id), text)}
                onShare={handleShare}
                user={user}
                onLoginRequest={onLoginRequest}
                navigate={(path) => {
                  const cleanPath = path.startsWith("/") ? path : "/" + path;
                  window.history.pushState(null, "", cleanPath);
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

interface FooterProps {
  companyName?: string;
  navigate?: (path: string) => void;
}

const Footer = ({ companyName = "zooda", navigate }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [contactInfo, setContactInfo] = useState({
    email: "zoodanew@gmail.com",
    address: "Vijayawada, India"
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pages/contact`)
      .then(res => {
        if (res.data.success && res.data.data && res.data.data.metadata) {
          const { email: contactEmail, address: contactAddress } = res.data.data.metadata;
          setContactInfo({
            email: contactEmail || "zoodanew@gmail.com",
            address: contactAddress || "Vijayawada, India"
          });
        }
      })
      .catch(err => {
        console.warn("Error loading contact info for footer:", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Name, Email, and Message are required!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/feedback`, {
        name,
        email,
        phone,
        message,
      });

      if (res.data.success) {
        setSuccessMsg("Thank you! Your feedback has been submitted successfully.");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setErrorMsg(res.data.message || "Failed to submit feedback.");
      }
    } catch (err: any) {
      console.error("Feedback submit error:", err);
      if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
        setSuccessMsg("Thank you! Your feedback has been submitted successfully (local simulation).");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setErrorMsg(err.response?.data?.message || err.message || "Failed to submit feedback.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FOOTER */}
      <footer className="bg-slate-50 text-slate-800 border-t border-slate-200 mt-12 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* TOP GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT COLUMN: BRAND & SLOGAN */}
            <div className="flex flex-col items-start space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-10 w-auto object-contain logo-image"
                />
                <span className="text-xl font-bold tracking-wider text-[#15A148]">
                  {companyName.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-slate-600 text-sm leading-relaxed">
                <p>Your website deserves to be seen.</p>
                <p>Your business deserves to stand out.</p>
                <p className="text-[#15A148] font-semibold mt-1">
                  Where Engagement Builds Visibility.
                </p>
              </div>
              <div className="space-y-1.5 text-slate-600 text-sm pt-2">
                <p className="flex items-center gap-2">
                  <span className="material-icons text-[#15A148] text-base">email</span>
                  {contactInfo.email}
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-icons text-[#15A148] text-base">place</span>
                  {contactInfo.address}
                </p>
              </div>
            </div>

            {/* MIDDLE COLUMN: NAV LINKS */}
            <div className="flex flex-col space-y-6 lg:pl-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#15A148]">Navigation</h3>
              <nav className="flex flex-col gap-3 text-slate-600 text-sm font-medium">
                <a href="/" onClick={(e) => { e.preventDefault(); navigate && navigate("/"); }} className="hover:text-[#15A148] transition-colors">Home</a>
                <a href="/blogs" onClick={(e) => { e.preventDefault(); navigate && navigate("/blogs"); }} className="hover:text-[#15A148] transition-colors">Blog</a>
                <a href="/about" onClick={(e) => { e.preventDefault(); navigate && navigate("/about"); }} className="hover:text-[#15A148] transition-colors">About</a>
                <a href="/posts" onClick={(e) => { e.preventDefault(); navigate && navigate("/posts"); }} className="hover:text-[#15A148] transition-colors">Posts</a>
                <a href="/contact" onClick={(e) => { e.preventDefault(); navigate && navigate("/contact"); }} className="hover:text-[#15A148] transition-colors">Contact</a>
                <a href="/terms" onClick={(e) => { e.preventDefault(); navigate && navigate("/terms"); }} className="hover:text-[#15A148] transition-colors">Terms</a>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate && navigate("/privacy"); }} className="hover:text-[#15A148] transition-colors">Privacy</a>
              </nav>
            </div>

            {/* RIGHT COLUMN: INTEGRATED FEEDBACK FORM */}
            <div className="flex flex-col space-y-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#15A148]">Give Feedback</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#15A148] focus:ring-1 focus:ring-[#15A148]/20 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#15A148] focus:ring-1 focus:ring-[#15A148]/20 transition-all"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#15A148] focus:ring-1 focus:ring-[#15A148]/20 transition-all"
                />
                <textarea
                  placeholder="Message or Feedback"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#15A148] focus:ring-1 focus:ring-[#15A148]/20 resize-none transition-all"
                />
                
                {successMsg && (
                  <p className="text-[#15A148] text-xs font-medium">{successMsg}</p>
                )}
                {errorMsg && (
                  <p className="text-red-500 text-xs font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#15A148] hover:bg-[#0f8a3a] text-white rounded-xl py-2 text-xs font-bold hover:shadow-lg hover:shadow-[#15A148]/20 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>Submitting...</>
                  ) : (
                    <>Submit Feedback</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* DISCLAIMER BOX */}
          <div className="border-t border-slate-200 pt-6 text-slate-500 text-xs leading-relaxed space-y-2">
            <p>
              Zooda showcases publicly available websites for discovery and does not own or control the content, services, or policies of the listed sites.
            </p>
            <p>
              If you are a website owner and would like your site removed from Zooda, please email <a href={`mailto:${contactInfo.email}`} className="text-[#15A148] hover:underline">{contactInfo.email}</a> and we will process the removal request.
            </p>
          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <a
              href="https://client.zooda.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 border border-[#15A148]/30 hover:border-[#15A148] bg-[#15A148]/5 hover:bg-[#15A148] text-[#15A148] hover:text-white rounded-xl transition-all font-semibold text-xs tracking-wide"
            >
              Business Registration - client.zooda.in
            </a>

            <p className="text-slate-500 text-xs">
              © {currentYear} {companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onOpenRegister: () => void;
}

const LoginModal = ({ isOpen, onClose, onLogin, onOpenRegister }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [forgotStep, setForgotStep] = useState<"email" | "reset" | null>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setForgotStep(null);
      setForgotEmail("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const userData = response.data.user;
      const token = response.data.token;

      const userToStore = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        isLoggedIn: true,
      };

      localStorage.setItem("user", JSON.stringify(userToStore));
      if (token) localStorage.setItem("authToken", token);
      window.dispatchEvent(new Event("user-state-change"));

      onLogin(userToStore);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/check-email`, {
        email: forgotEmail,
      });

      if (res.data.exists) {
        setForgotStep("reset");
      } else setError("Email not found. Please check your email");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error checking email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email: forgotEmail,
        newPassword,
      });

      alert("Password updated successfully");
      setForgotStep(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setForgotStep(null);
    setForgotEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSwitchToRegister = () => {
    onClose();
    onOpenRegister();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4" 
      onClick={onClose}
      style={{
        background: "linear-gradient(135deg, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.95) 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
    >
      <div 
        className="bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-0 p-6 sm:p-8 w-full max-w-[390px] relative overflow-y-auto scrollbar-thin animate-fade-in flex flex-col justify-between max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          className="zooda-premium-modal-close"
        >
          <span className="material-icons">close</span>
        </button>

        {/* Top Floating Square Icon */}
        <div className="flex justify-center mb-5 mt-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/80">
            <span className="material-icons text-slate-800 text-2xl font-bold leading-none">login</span>
          </div>
        </div>

        {/* Header Block */}
        <h3 className="text-center font-extrabold text-slate-900 text-xl tracking-tight leading-none mb-2">
          {forgotStep ? (forgotStep === "email" ? "Forgot Password" : "Reset Password") : "Sign in with email"}
        </h3>
        <p className="text-center text-slate-500 text-[11px] leading-relaxed max-w-[280px] mx-auto mb-6">
          {forgotStep ? "Recover your account credentials instantly by entering your registered email address." : "Access your Zooda account to bring your store, posts, and teams together. For free"}
        </p>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-600 text-center text-xs font-semibold">
            {error}
          </div>
        )}

        {!forgotStep ? (
          <>
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Email Input Field */}
              <div className="zooda-modal-input-wrapper">
                <span className="zooda-modal-input-icon">mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="Email"
                  className="zooda-modal-input-field"
                />
              </div>

              {/* Password Input Field */}
              <div className="zooda-modal-input-wrapper">
                <span className="zooda-modal-input-icon">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Password"
                  className="zooda-modal-input-field"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end pt-0.5">
                <button 
                  type="button" 
                  className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 transition" 
                  onClick={() => setForgotStep("email")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button 
                type="submit" 
                className="zooda-premium-submit-btn" 
                disabled={loading}
              >
                {loading ? "Signing In..." : "Get Started"}
              </button>
            </form>

            {/* Dotted Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/60 border-dashed"></div>
              </div>
              <span className="relative bg-white px-3 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                Or sign in with
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("Social integration currently in developer preview.")}
                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold transition shadow-sm active:scale-[0.98]"
              >
                <img src="https://unpkg.com/simple-icons@latest/icons/google.svg" alt="Google" className="w-3.5 h-3.5" style={{ filter: 'grayscale(1)' }} />
                Google
              </button>
              <button
                type="button"
                onClick={() => alert("Social integration currently in developer preview.")}
                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold transition shadow-sm active:scale-[0.98]"
              >
                <img src="https://unpkg.com/simple-icons@latest/icons/facebook.svg" alt="Facebook" className="w-3.5 h-3.5" style={{ filter: 'grayscale(1)' }} />
                Facebook
              </button>
            </div>

            {/* Switch to Register */}
            <div className="text-center text-[10px] text-slate-500 mt-6 pt-2 border-t border-slate-100">
              <span>Don't have an account? </span>
              <button 
                className="font-bold text-slate-900 hover:underline ml-0.5" 
                onClick={handleSwitchToRegister}
              >
                Register here
              </button>
            </div>
          </>
        ) : forgotStep === "email" ? (
          <>
            <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
              <div className="zooda-modal-input-wrapper">
                <span className="zooda-modal-input-icon">mail</span>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter registered email"
                  className="zooda-modal-input-field"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="submit" 
                  className="zooda-premium-submit-btn" 
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Verify Email"}
                </button>
                <button 
                  type="button" 
                  className="w-full py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition" 
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              {/* New Password */}
              <div className="zooda-modal-input-wrapper">
                <span className="zooda-modal-input-icon">lock</span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="zooda-modal-input-field"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition flex items-center justify-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="zooda-modal-input-wrapper">
                <span className="zooda-modal-input-icon">lock</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="zooda-modal-input-field"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition flex items-center justify-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="submit" 
                  className="zooda-premium-submit-btn" 
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Update Password"}
                </button>
                <button 
                  type="button" 
                  className="w-full py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition" 
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (user: User) => void;
  onOpenLogin: () => void;
}

const RegisterModal = ({
  isOpen,
  onClose,
  onRegister,
  onOpenLogin,
}: RegisterModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  /* -------------------- RESET ON OPEN -------------------- */
  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setInterests([]);
      setError("");
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  /* -------------------- FETCH CATEGORIES -------------------- */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/admin/categories`);
      setCategories(res.data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- FORM SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return setError("Enter a valid 10-digit mobile number");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (interests.length === 0) {
      return setError("Select at least one interest");
    }

    setRegisterLoading(true);

    try {
      // Register the client (customer)
      const registerRes = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        email,
        mobile,
        password,
        interests,
      });

      // Get user data from registration response
      const userData = registerRes.data.user || registerRes.data.client || registerRes.data;

      // Automatically log in the user after successful registration
      try {
        const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email,
          password,
        });

        const loginUserData = loginRes.data.user || userData;
        const token = loginRes.data.token;

        const userToStore: User = {
          _id: loginUserData._id,
          name: loginUserData.name,
          email: loginUserData.email,
          mobile: loginUserData.mobile,
          isLoggedIn: true,
        };

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userToStore));
        if (token) localStorage.setItem("authToken", token);
        window.dispatchEvent(new Event("user-state-change"));

        // Call onRegister to update parent state
        onRegister(userToStore);
        onClose();

        // Show success message
        alert("Registration successful! You are now logged in.");

      } catch (loginErr: any) {
        console.warn("Auto-login failed after registration:", loginErr);
        
        const userToStore: User = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          isLoggedIn: false,
        };

        // Store user data for manual login later
        localStorage.setItem("user", JSON.stringify(userToStore));
        window.dispatchEvent(new Event("user-state-change"));
        
        alert("Registration successful! Please login with your credentials.");
        onClose();
        onOpenLogin();
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  /* -------------------- INTEREST TOGGLE -------------------- */
  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const switchToLogin = () => {
    onClose();
    onOpenLogin();
  };

  if (!isOpen) return null;

  /* -------------------- UI -------------------- */
  return (
    <div 
      className="modal-overlay fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4" 
      onClick={onClose}
      style={{
        background: "linear-gradient(135deg, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.95) 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
    >
      <div 
        className="bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-0 p-6 sm:p-8 w-full max-w-[390px] relative overflow-y-auto scrollbar-thin animate-fade-in flex flex-col justify-between max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          className="zooda-premium-modal-close"
        >
          <span className="material-icons">close</span>
        </button>

        {/* Top Floating Square Icon */}
        <div className="flex justify-center mb-5 mt-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/80">
            <span className="material-icons text-slate-800 text-2xl font-bold leading-none">
              person_add
            </span>
          </div>
        </div>

        {/* Header Block */}
        <h3 className="text-center font-extrabold text-slate-900 text-xl tracking-tight leading-none mb-2">
          Create account
        </h3>
        <p className="text-center text-slate-500 text-[11px] leading-relaxed max-w-[280px] mx-auto mb-6">
          Sign up to bring your storefront, custom posts, and teams together. For free
        </p>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-600 text-center text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="zooda-modal-input-wrapper">
            <span className="zooda-modal-input-icon">person</span>
            <input
              type="text"
              required
              value={name}
              disabled={registerLoading}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="zooda-modal-input-field"
            />
          </div>

          {/* Email */}
          <div className="zooda-modal-input-wrapper">
            <span className="zooda-modal-input-icon">mail</span>
            <input
              type="email"
              required
              value={email}
              disabled={registerLoading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="zooda-modal-input-field"
            />
          </div>

          {/* Mobile */}
          <div className="zooda-modal-input-wrapper">
            <span className="zooda-modal-input-icon">phone</span>
            <input
              type="tel"
              required
              value={mobile}
              maxLength={10}
              disabled={registerLoading}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              className="zooda-modal-input-field"
            />
          </div>

          {/* Password */}
          <div className="zooda-modal-input-wrapper">
            <span className="zooda-modal-input-icon">lock</span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              disabled={registerLoading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="zooda-modal-input-field"
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition flex items-center justify-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Interests */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Interests <span className="text-slate-400 font-normal lowercase">(at least one)</span>
            </label>
            
            {loading ? (
              <div className="text-xs text-slate-400 italic">Loading categories...</div>
            ) : (
              <div 
                className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 max-h-[105px] overflow-y-auto scrollbar-thin"
              >
                {categories.map((cat) => {
                  const isSelected = interests.includes(cat.name);
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      disabled={registerLoading}
                      onClick={() => toggleInterest(cat.name)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-[0.98] ${
                        isSelected 
                          ? "bg-[#15A148]/10 text-[#15A148] border border-[#15A148]/30" 
                          : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={registerLoading}
            className="zooda-premium-submit-btn"
          >
            {registerLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="text-center text-[10px] text-slate-500 mt-6 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <button 
            className="font-bold text-slate-900 hover:underline ml-0.5" 
            onClick={switchToLogin}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// CUSTOMER INTERACTIVE WHATSAPP CHATS PAGE
// ----------------------------------------------------------------------
interface ChatsPageProps {
  user: any;
  navigateTo: (hash: string) => void;
  onLoginRequest: () => void;
}

const ChatsPage = ({ user, navigateTo, onLoginRequest }: ChatsPageProps) => {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch customer threads
  const fetchThreads = async (silent = false) => {
    if (!silent) setLoadingThreads(true);
    const token = localStorage.getItem("authToken");
    if (!token || !user) {
      const startChatWithBusinessId = localStorage.getItem("startChatWithBusinessId");
      const startChatWithBusinessDataStr = localStorage.getItem("startChatWithBusinessData");
      if (startChatWithBusinessId && startChatWithBusinessDataStr) {
        const startChatBusinessData = JSON.parse(startChatWithBusinessDataStr);
        const virtualThread = {
          _id: `virtual_${startChatWithBusinessId}`,
          business: startChatBusinessData,
          isAiActive: true,
          lastMessageText: "Type a message to start chatting...",
          lastMessageSender: "ai",
          lastMessageTimestamp: new Date().toISOString(),
          isVirtual: true
        };
        setThreads([virtualThread]);
        setSelectedThread(virtualThread);
      }
      setLoadingThreads(false);
      return;
    }
    try {
      const res = await axios.get("https://zooda.vercel.app/api/chats/customer", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const startChatWithBusinessId = localStorage.getItem("startChatWithBusinessId");
        const startChatWithBusinessDataStr = localStorage.getItem("startChatWithBusinessData");

        let updatedChats = res.data.chats;
        if (startChatWithBusinessId && startChatWithBusinessDataStr) {
          const startChatBusinessData = JSON.parse(startChatWithBusinessDataStr);
          // Check if thread already exists
          const exists = res.data.chats.some((t: any) => t.business && t.business._id === startChatWithBusinessId);
          if (!exists) {
            // Add virtual thread at the top
            const virtualThread = {
              _id: `virtual_${startChatWithBusinessId}`,
              business: startChatBusinessData,
              isAiActive: true,
              lastMessageText: "Type a message to start chatting...",
              lastMessageSender: "ai",
              lastMessageTimestamp: new Date().toISOString(),
              isVirtual: true
            };
            updatedChats = [virtualThread, ...res.data.chats];
          }
        }

        setThreads(updatedChats);
        
        // Auto select first thread or startChatWithBusinessId
        if (startChatWithBusinessId) {
          const found = updatedChats.find((t: any) => t.business && t.business._id === startChatWithBusinessId);
          if (found) {
            setSelectedThread(found);
            localStorage.removeItem("startChatWithBusinessId");
            localStorage.removeItem("startChatWithBusinessData");
          } else if (updatedChats.length > 0 && !selectedThread) {
            setSelectedThread(updatedChats[0]);
          }
        } else if (updatedChats.length > 0 && !selectedThread) {
          setSelectedThread(updatedChats[0]);
        } else if (selectedThread) {
          // Sync thread details (handling both virtual and normal)
          if (selectedThread.isVirtual) {
            const stillVirtual = updatedChats.find((t: any) => t._id === selectedThread._id);
            if (stillVirtual) {
              setSelectedThread(stillVirtual);
            } else {
              // The virtual thread has transitioned to a real thread on the backend!
              const realThread = updatedChats.find((t: any) => t.business && t.business._id === selectedThread.business._id);
              if (realThread) setSelectedThread(realThread);
            }
          } else {
            const current = res.data.chats.find((t: any) => t._id === selectedThread._id);
            if (current) setSelectedThread(current);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load customer threads", err);
    } finally {
      if (!silent) setLoadingThreads(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    if (user) {
      const interval = setInterval(() => fetchThreads(true), 4000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Fetch conversation messages
  const fetchMessages = async () => {
    if (!selectedThread) return;
    if (!user || selectedThread.isVirtual) {
      setMessages([{
        role: "ai",
        text: `Hi! Welcome to ${selectedThread.business.businessName || "our business"} AI Chat. Ask me anything!`,
        timestamp: new Date().toISOString()
      }]);
      return;
    }
    setLoadingMessages(true);
    try {
      const res = await axios.get(
        `https://zooda.vercel.app/api/chats/history?businessId=${selectedThread.business._id}&userId=${user.id || user._id}`
      );
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Failed to load message history", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedThread) {
      fetchMessages();
    }
  }, [selectedThread?.business?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMessages]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread || sending) return;

    const text = replyText.trim();
    setReplyText("");

    if (!user) {
      const count = parseInt(localStorage.getItem("zooda_guest_chats_count") || "0");
      const busSlug = slugify(selectedThread.business.businessName || "business");

      if (count >= 5) {
        localStorage.setItem("zooda_guest_chats_limit_bus_slug", busSlug);
        onLoginRequest();
        return;
      }

      const newCount = count + 1;
      localStorage.setItem("zooda_guest_chats_count", newCount.toString());
      setSending(true);

      const userMsg = {
        role: "user",
        text,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        const lowerText = text.toLowerCase();
        let reply = "";
        const busName = selectedThread.business.businessName || "us";
        const busDesc = selectedThread.business.businessDescription || "";

        if (lowerText.includes("product") || lowerText.includes("buy") || lowerText.includes("price") || lowerText.includes("cost")) {
          reply = `We have many amazing products! You can view all our items and their prices by visiting our profile and checking the Products tab.`;
        } else if (lowerText.includes("post") || lowerText.includes("reel") || lowerText.includes("update")) {
          reply = `Check out our latest reels and snapping feed posts in our profile to see what we've been up to!`;
        } else if (lowerText.includes("follow")) {
          reply = `Make sure to click the Follow button on our page to get notified whenever we post new updates!`;
        } else if (lowerText.includes("where") || lowerText.includes("address") || lowerText.includes("location") || lowerText.includes("map")) {
          reply = `We are located at our registered address. You can click 'Visit Site' on our profile page to open our official website!`;
        } else if (lowerText.includes("help") || lowerText.includes("who") || lowerText.includes("about")) {
          reply = `We are ${busName}! ${busDesc ? busDesc : "A premium local business featured on Zooda."}`;
        } else {
          reply = `Hi! Thank you for messaging ${busName} on Zooda AI Chat. Since you are browsing as a guest, you have ${5 - newCount} free messages remaining before login. Ask us about our products, posts, or company info!`;
        }

        const aiMsg = {
          role: "ai",
          text: reply,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, aiMsg]);
        setSending(false);
      }, 600);

      return;
    }

    setSending(true);

    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.post(
        "https://zooda.vercel.app/api/chats/customer/send",
        { businessId: selectedThread.business._id, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Optimistically add user message
        setMessages((prev) => [...prev, res.data.userMessage]);
        
        // If there is an AI response, append with a nice typing simulation delay!
        if (res.data.aiMessage) {
          setTimeout(() => {
            setMessages((prev) => [...prev, res.data.aiMessage]);
          }, 800);
        }

        // If it was virtual, we trigger real thread auto selection on next fetch
        if (selectedThread.isVirtual) {
          localStorage.setItem("startChatWithBusinessId", selectedThread.business._id);
          localStorage.setItem("startChatWithBusinessData", JSON.stringify(selectedThread.business));
        }
        
        fetchThreads(true);
      }
    } catch (err) {
      console.error("Failed to send customer message", err);
    } finally {
      setSending(false);
    }
  };

  if (!user && !localStorage.getItem("startChatWithBusinessId")) {
    return (
      <div className="chats-lock-container">
        <div className="chats-lock-card animate-fade-in">
          <div className="lock-icon-glow">
            <Lock size={32} className="lock-icon" />
          </div>
          <h2>Connect with Zooda AI Chats</h2>
          <p>
            Log in to chat directly with local businesses, query AI assistants for instant product and hours information, and contact shop owners directly in real-time.
          </p>
          <button onClick={onLoginRequest} className="btn-chat-login font-bold">
            <Sparkles size={16} /> Log In / Register to Chat
          </button>
        </div>
      </div>
    );
  }

  const filteredThreads = threads.filter((t: any) =>
    t.business && t.business.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const hasActiveChat = selectedThread !== null;

  return (
    <div className="chats-page-wrapper">
      <div className={`chats-container border border-border/80 bg-card overflow-hidden ${hasActiveChat ? 'active-chat' : ''}`}>
        
        {/* Sidebar list */}
        <div className="chats-sidebar border-r border-border/60">
          <div className="sidebar-header bg-card">
            <div className="sidebar-title flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              <h2 className="font-extrabold text-lg text-white">Your Zooda Chats</h2>
            </div>
            <div className="sidebar-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search active chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="sidebar-list scrollbar-thin">
            {loadingThreads && threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span className="text-xs text-muted-foreground mt-2">Loading threads...</span>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs font-semibold">
                <Bot size={24} className="mx-auto mb-2 opacity-50" />
                No active conversations. Visit a business profile to start chatting!
              </div>
            ) : (
              filteredThreads.map((thread: any) => {
                const isSelected = selectedThread?._id === thread._id;
                return (
                  <button
                    key={thread._id}
                    onClick={() => setSelectedThread(thread)}
                    className={`sidebar-item flex gap-3 hover:bg-muted/30 ${isSelected ? "active" : ""}`}
                  >
                    <div className="relative">
                      <div className="avatar border border-border">
                        {thread.business.logoUrl ? (
                          <img
                            src={thread.business.logoUrl}
                            alt={thread.business.businessName}
                          />
                        ) : (
                          <Building size={16} className="text-primary" />
                        )}
                      </div>
                      {thread.business.isAiChatEnabled && (
                        <div className="ai-badge-dot">
                          <Bot size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-sm text-white truncate">{thread.business.businessName}</span>
                        <span className="timestamp text-[9px] text-muted-foreground">{formatTime(thread.lastMessageTimestamp)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate leading-normal">
                        {thread.lastMessageSender === 'ai' ? 'ðŸ¤– ' : thread.lastMessageSender === 'business' ? 'ðŸ‘¤ ' : ''}
                        {thread.lastMessageText}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Feed Pane */}
        <div className="chats-feed bg-card">
          {selectedThread ? (
            <>
              {/* Header */}
              <div className="feed-header border-b border-border/60 bg-muted/10">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSelectedThread(null)}
                    className="md:hidden p-2 text-white hover:bg-muted rounded-xl mr-1"
                    title="Back to list"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  <div className="avatar border border-border">
                    {selectedThread.business.logoUrl ? (
                      <img
                        src={selectedThread.business.logoUrl}
                        alt={selectedThread.business.businessName}
                      />
                    ) : (
                      <Building size={16} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{selectedThread.business.businessName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        {selectedThread.business.businessCategory}
                      </span>
                      {selectedThread.business.isAiChatEnabled && (
                        <>
                          <span className="text-[10px] text-muted-foreground">â€¢</span>
                          <span className={`ai-active-status-badge uppercase text-[8px] font-extrabold px-1.5 py-0.5 rounded-md ${selectedThread.isAiActive ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                            {selectedThread.isAiActive ? 'ðŸ¤– AI ACTIVE' : 'ðŸ‘¤ Direct Reply'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo(slugify(selectedThread.business.businessName || "business"))}
                  className="btn-visit-profile flex items-center gap-1 text-[10px] font-bold"
                >
                  Visit Store <ChevronRight size={12} />
                </button>
              </div>

              {/* Feed messages */}
              <div className="feed-messages scrollbar-thin">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-8">No messages in this chat. Say hello!</p>
                ) : (
                  messages.map((msg: any, idx: number) => {
                    const isSelf = msg.role === "user";
                    const isAi = msg.role === "ai";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`message-bubble max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                            isSelf
                              ? "self bg-primary text-white rounded-br-none shadow-md"
                              : isAi
                              ? "ai bg-indigo-500/10 text-indigo-200 border border-indigo-500/25 rounded-bl-none shadow-sm"
                              : "business bg-muted text-foreground rounded-bl-none border border-border/50 shadow-sm"
                          }`}
                        >
                          {!isSelf && (
                            <div className={`flex items-center gap-1 text-[9px] font-extrabold tracking-widest uppercase mb-1 ${isAi ? 'text-indigo-400' : 'text-indigo-500'}`}>
                              {isAi ? <Bot size={10} /> : <User size={10} />}
                              {isAi ? "AI Assistant" : "Business Owner"}
                            </div>
                          )}
                          <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                          <span className={`text-[8px] block text-right mt-1 font-semibold ${isSelf ? 'text-primary-foreground/75' : 'text-muted-foreground/75'}`}>
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input field */}
              <form onSubmit={handleSendMessage} className="feed-input-bar border-t border-border/60 bg-muted/10">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className="btn-send flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Bot size={48} className="text-primary/30 mb-4 animate-pulse" />
              <h3 className="font-extrabold text-white text-lg">Zooda AI Customer Chat</h3>
              <p className="text-xs max-w-sm mt-1 leading-relaxed">
                Connect directly with business profiles on Zooda. Ask Zooda's AI chatbot questions, or wait for the merchant to reply to you directly!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const useHistoryRouter = () => {
  const normalizePath = (path: string) => {
    let p = path;
    const hash = window.location.hash;
    if (hash && (hash.startsWith("#/") || hash.startsWith("#"))) {
      p = hash.replace(/^#\/?/, "");
    } else {
      if (!p) return "";
      p = p.replace(/^\/|index\.html$/, "");
    }
    if (p.endsWith("/")) p = p.slice(0, -1);
    p = p.split('?')[0];
    p = p.split('#')[0];
    if (p.startsWith("/")) p = p.slice(1);
    return p || "home";
  };

  const [currentPath, setCurrentPath] = useState<string>(
    normalizePath(window.location.pathname)
  );

  useEffect(() => {
    // Cleanse hashtag and rewrite immediately to clean path!
    const hash = window.location.hash;
    if (hash && (hash.startsWith("#/") || hash.startsWith("#"))) {
      let clean = hash.replace(/^#\/?/, "");
      if (clean.endsWith("/")) clean = clean.slice(0, -1);
      clean = clean.split('?')[0];
      clean = clean.split('#')[0];
      if (!clean.startsWith("/")) clean = "/" + clean;
      window.history.replaceState(null, "", clean || "/home");
      setCurrentPath(normalizePath(clean));
    }

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    let cleanPath = path;
    if (cleanPath.startsWith("#")) {
      cleanPath = cleanPath.replace(/^#company-|^#/, "");
    }
    if (!cleanPath.startsWith("/")) {
      cleanPath = "/" + cleanPath;
    }
    cleanPath = cleanPath.replace(/\/+/g, "/");
    if (cleanPath.endsWith("/") && cleanPath.length > 1) {
      cleanPath = cleanPath.slice(0, -1);
    }
    
    // Pure clean history pushState routing - no hashtag!
    window.history.pushState(null, "", cleanPath);
    setCurrentPath(normalizePath(cleanPath));
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new Event("popstate"));
  };

  const getRouteParams = () => {
    const path = currentPath;
    if (!path || path === "home") {
      return { type: "home" };
    }

    if (path.startsWith("post-")) {
      const parts = path.replace("post-", "").split("-");
      const id = parts[parts.length - 1]; // The last part is always the ObjectId ID
      return { type: "post", id: id };
    }

    if (path.startsWith("blog-") && !path.startsWith("blog-admin")) {
      const id = path.replace("blog-", "");
      return { type: "blog-detail", id: id };
    }

    switch (path) {
      case "blogs":
        return { type: "blogs" };
      case "blog-admin":
        return { type: "blog-admin" };
      case "profile":
        return { type: "profile" };
      case "posts":
        return { type: "posts" };
      case "about":
        return { type: "about" };
      case "privacy":
        return { type: "privacy" };
      case "terms":
        return { type: "terms" };
      case "contact":
        return { type: "contact" };
      case "search":
        return { type: "search" };
      case "bot":
        return { type: "bot" };
      case "chat":
      case "chats":
        return { type: "chats" };
      default:
        let companyId = path;
        if (companyId.startsWith("company-")) {
          companyId = companyId.replace("company-", "");
        }
        return { type: "company", id: companyId };
    }
  };

  return {
    currentPath,
    navigate,
    routeParams: getRouteParams(),
  };
};

// ==========================================================================
// ZOODA BLOGS CORE DATABASE & SCHEMAS (Persistent & Pre-seeded)
// ==========================================================================

interface BlogAuthor {
  name: string;
  avatar: string;
  role: string;
  verified: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  publishedAt: string;
  author: BlogAuthor;
  views?: number;
}

const INITIAL_BLOGS: BlogPost[] = [
  {
    _id: "blog-seo-secrets",
    title: "Zooda's SEO Secrets: How to Propel Your Shop to Page 1 of Search Engines",
    slug: "seo-secrets-to-propel-your-shop",
    category: "SEO Tips",
    readTime: "4 min read",
    excerpt: "Learn the master strategies to boost your shop's indexing, build premium keywords, and structure your metadata so customers can find your services instantly.",
    content: `
      <p>In the digital age, having an incredible service or store is only half the battle. The real challenge is making sure customers can find you when they search. <strong>Search Engine Optimization (SEO)</strong> is the premium vehicle that bridges this gap.</p>
      
      <p>Here are the master-class strategies to propel your storefront to Page 1 of search engine indexes:</p>
      
      <ol>
        <li><strong>Focus on Intent-Based Keywords:</strong> Do not just target "plumber". Target "expert emergency plumber in Vijayawada". Long-tail keywords have lower competition and much higher conversion rates.</li>
        <li><strong>Fine-Tune Your Meta Description:</strong> Your meta description is your ad copy. Keep it between 120 and 160 characters, and make sure it has a compelling Call to Action (CTA).</li>
        <li><strong>Optimize Your Alt Image Tags:</strong> Search engines cannot see images; they read them. Adding detailed alt text like <em class="wysiwyg-text-orange">"Vijayawada Local Shop Storefront Showcase"</em> allows search crawlers to catalog your images.</li>
      </ol>

      <img src="https://picsum.photos/800/450?random=1" alt="SEO Dashboard Audit" class="blog-img-full" />

      <p>By integrating these optimizations into your business facts page, you ensure maximum local reach. Feel free to explore our <a href="/" class="wysiwyg-text-blue">Zooda Business Network</a> to see how other top local merchants structure their profiles for peak discovery!</p>
    `,
    imageUrl: "https://picsum.photos/600/350?random=1",
    metaTitle: "Zooda's SEO Secrets: Boost Local Business Search Rankings",
    metaDescription: "Master strategies to boost your local shop search engine rankings, write killer meta descriptions, and build high-converting keywords instantly.",
    keywords: "seo secrets, local business marketing, search rankings, local seo description",
    publishedAt: "June 02, 2026",
    author: {
      name: "Zooda Editorial Team",
      avatar: "https://picsum.photos/100/100?random=99",
      role: "SEO & Growth Specialists",
      verified: true
    },
    views: 142
  },
  {
    _id: "blog-ai-sales",
    title: "Mastering the AI Chat Assistant: Tapping into Automated Conversational Sales",
    slug: "tapping-into-automated-sales-ai",
    category: "AI Storefronts",
    readTime: "5 min read",
    excerpt: "Uncover how integrating custom business facts into Zooda's intelligent conversational assistant automates merchant workflows and turns visitors into customers.",
    content: `
      <p>Automated chat is no longer a luxury; it is the cornerstone of premium merchant workflows. Integrating an intelligent conversational agent means you are open for business 24 hours a day, 7 days a week.</p>
      
      <p>Here is how you can leverage <strong class="wysiwyg-text-green">Zooda AI Chat Integration</strong> to supercharge your merchant operations:</p>
      
      <ul>
        <li><strong>Feed Exact Store Facts:</strong> Upload your business hours, refund policy, and product availability directly into the model to guarantee accurate conversational answers.</li>
        <li><strong>Automatic Lead Capture:</strong> Let the AI gather customer names, phone numbers, and query descriptions while you sleep, populating your dashboard instantly.</li>
        <li><strong>Personalized Discounts:</strong> Train the assistant to trigger premium micro-discounts during engagement spikes to turn passive visitors into buyers.</li>
      </ul>

      <img src="https://picsum.photos/800/450?random=2" alt="Conversational AI Showcase" class="blog-img-medium" />

      <p>Merchants who have active AI assistants report a <strong>140% spike in direct inquiries</strong> and a significant reduction in support email workloads. Launch your own merchant portal on the <a href="/" class="wysiwyg-text-green">Zooda Client Dashboard</a> and activate your conversational growth engine today!</p>
    `,
    imageUrl: "https://picsum.photos/600/350?random=2",
    metaTitle: "Mastering the AI Chat Assistant: Automated Conversational Sales",
    metaDescription: "Discover how integrating precise business facts into Zooda's AI conversational assistant automates support, captures leads, and grows merchant sales.",
    keywords: "conversational ai, zooda assistant, merchant automation, shop chat bot",
    publishedAt: "June 01, 2026",
    author: {
      name: "Zooda Tech Labs",
      avatar: "https://picsum.photos/100/100?random=98",
      role: "Conversational AI Engineers",
      verified: true
    },
    views: 98
  },
  {
    _id: "blog-foot-traffic",
    title: "5 Local Marketing Hacks to Double Retail Store Foot-Traffic this Weekend",
    slug: "local-marketing-hacks-to-double-foot-traffic",
    category: "Local Business",
    readTime: "3 min read",
    excerpt: "Actionable, simple storefront marketing hacks leveraging micro-promotions, local mapping, and highly engaging digital flyers to boost local foot-traffic.",
    content: `
      <p>Physical retail storefronts have an incredible superpower: instant, real-life human connection. By utilizing clever digital triggers, you can double your physical walk-ins this weekend.</p>
      
      <p>Try these highly actionable marketing hacks:</p>
      
      <ul>
        <li><strong class="wysiwyg-text-orange">Trigger a Micro-Promotion:</strong> Publish a localized post offering "15% off for the next 20 walk-ins". The scarcity triggers immediate visits.</li>
        <li><strong>Leverage Beautiful Reels Flyers:</strong> Put up high-resolution vertical video reels showcasing your active shop energy and products.</li>
        <li><strong>Optimize Local Mapping Points:</strong> Ensure your geolocational listings are linked so mapping apps direct customers right to your door.</li>
      </ul>

      <img src="https://picsum.photos/800/450?random=3" alt="Local Retail Foot Traffic" class="blog-img-small" />

      <p>Running local storefront campaigns is incredibly satisfying when you see digital engagement translate directly to checkout counter bells. For more premium tips, register your store as an official merchant and check our platform guides!</p>
    `,
    imageUrl: "https://picsum.photos/600/350?random=3",
    metaTitle: "5 Local Marketing Hacks: Double Store Foot-Traffic",
    metaDescription: "Try these 5 localized storefront marketing hacks using micro-promotions, mapping, and high-energy flyers to double retail store walk-ins.",
    keywords: "local marketing, store foot traffic, storefront hacks, brick and mortar retail",
    publishedAt: "May 30, 2026",
    author: {
      name: "Zooda Growth Team",
      avatar: "https://picsum.photos/100/100?random=97",
      role: "Retail Growth Analysts",
      verified: true
    },
    views: 215
  }
];

// Helper to initialize and retrieve blogs from localStorage
const getStoredBlogs = (): BlogPost[] => {
  const stored = localStorage.getItem("zooda_blogs");
  if (!stored) {
    localStorage.setItem("zooda_blogs", JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_BLOGS;
  }
};

const saveStoredBlogs = (blogs: BlogPost[]) => {
  localStorage.setItem("zooda_blogs", JSON.stringify(blogs));
};


// ==========================================================================
// 1️⃣ USER PAGE BLOGS: RESPONSIVE BLOG FEED PAGE (Grid/List View & Search)
// ==========================================================================

interface BlogsPageProps {
  onSelectBlog: (id: string) => void;
  navigate: (path: string) => void;
}

const BlogsPage = ({ onSelectBlog, navigate }: BlogsPageProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setBlogs(getStoredBlogs());
  }, []);

  const categories = ["All", "SEO Tips", "AI Storefronts", "Local Business"];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.keywords.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER & BRANDING */}
        <div className="text-center space-y-3">
          <span className="bg-[#15A148]/10 text-[#15A148] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Zooda Editorial
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Insights, Stories & Shop Growth Guides
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Your master resource for local commerce, conversational sales automation, SEO tips, and local marketing hacks. Learn how to grow your business storefront.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          {/* Categories tags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#15A148] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Search guides, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white transition-all"
            />
          </div>
        </div>



        {/* BLOGS DISPLAY FEED (Grid / List responsive) */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => onSelectBlog(blog._id)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group cursor-pointer flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => (e.currentTarget.src = `https://picsum.photos/600/350?random=${blog._id}`)}
                  />
                  <span className="absolute top-3 left-3 bg-[#15A148] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
                    {blog.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Meta stats */}
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                      <span>{blog.publishedAt}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    {/* Title */}
                    <h2 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#15A148] transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    {/* Description excerpt */}
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Read Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 w-full">
                    {/* Author brief */}
                    <div className="flex items-center gap-1.5">
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[10px] font-bold text-slate-700 leading-none">{blog.author.name}</span>
                    </div>

                    <span className="text-xs font-bold text-[#1b4fd8] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Read Article
                      <span className="material-icons text-xs leading-none font-bold">chevron_right</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl max-w-md mx-auto space-y-4 shadow-sm">
            <span className="material-icons text-slate-400 text-5xl">menu_book</span>
            <h3 className="text-slate-900 font-bold text-base">No articles found</h3>
            <p className="text-slate-500 text-xs">Try adjusting your filters or search keywords to find articles.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="bg-[#15A148] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================================================
// 2️⃣ DYNAMIC ARTICLE DETAIL PAGE (Editorial layout, dynamic SEO meta updates)
// ==========================================================================

interface BlogDetailPageProps {
  blogId: string;
  navigate: (path: string) => void;
}

const BlogDetailPage = ({ blogId, navigate }: BlogDetailPageProps) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    const list = getStoredBlogs();
    const match = list.find((b) => b._id === blogId);
    if (match) {
      setBlog(match);
      
      // Increment views count and persist to localStorage
      const updatedList = list.map((b) => {
        if (b._id === blogId) {
          return { ...b, views: (b.views || 0) + 1 };
        }
        return b;
      });
      saveStoredBlogs(updatedList);
    }
  }, [blogId]);

  useEffect(() => {
    if (blog) {
      // DYNAMIC SEO OPTIMIZATION INTERACTIVE ACTIONS
      document.title = blog.metaTitle || `${blog.title} | Zooda Blog`;
      
      // Meta description tag
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', blog.metaDescription || blog.excerpt);

      // Keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', blog.keywords);
    }

    return () => {
      // Restore standard title
      document.title = "Zooda - Where Engagement Builds Visibility";
    };
  }, [blog]);

  if (!blog) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <span className="material-icons text-5xl text-red-500">warning</span>
          <h2 className="text-slate-900 font-extrabold text-lg">Article Not Found</h2>
          <p className="text-slate-500 text-xs">This guide may have been unpublished or removed by administrators.</p>
          <button
            onClick={() => navigate("/blogs")}
            className="bg-[#15A148] text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="w-full min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* BACK ACTION */}
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-1 text-slate-500 hover:text-[#15A148] text-xs font-bold transition-all focus:outline-none group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1 mr-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Articles
        </button>

        {/* DYNAMIC ARTICLE HEAD */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#15A148]/10 text-[#15A148] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">
              {blog.category}
            </span>
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
              <span>{blog.publishedAt}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            {blog.title}
          </h1>

          {/* VERIFIED AUTHOR PANEL */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl w-full shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-300"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 leading-none">{blog.author.name}</span>
                  {blog.author.verified && (
                    <span className="material-icons text-emerald-600 text-xs leading-none">verified</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 leading-none font-medium">{blog.author.role}</p>
              </div>
            </div>
            
            <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2.5 py-1 rounded-lg">
              Official Publisher
            </span>
          </div>
        </div>

        {/* FEATURED COVER IMAGE */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = `https://picsum.photos/800/450?random=${blog._id}`)}
          />
        </div>

        {/* FULL HTML DYNAMIC EDITORIAL CONTENT */}
        <div 
          className="blog-content-wrapper text-slate-800 text-xs md:text-sm leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* BOTTOM NEWSLETTER BOX */}
        <div className="border-t border-slate-200 pt-8 mt-12">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center space-y-4 shadow-sm">
            <span className="material-icons text-emerald-600 text-4xl">local_post_office</span>
            <h3 className="text-slate-900 font-extrabold text-base leading-none">Grow Your Local Storefront</h3>
            <p className="text-slate-600 text-xs max-w-sm mx-auto leading-relaxed">
              Get the latest marketing hacks, conversational automation tips, and SEO secrets delivered straight to your inbox.
            </p>
            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148]"
              />
              <button
                onClick={() => alert("Thank you for subscribing to Zooda Insights!")}
                className="bg-[#15A148] hover:bg-[#118039] text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* RECOMMENDED ARTICLES PANEL */}
        <div className="border-t border-slate-200 pt-8 mt-12 space-y-6">
          <h3 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5 font-poppins">
            <span className="material-icons text-[#15A148] text-lg leading-none">auto_awesome</span>
            Recommended Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              const all = getStoredBlogs();
              // Prioritize same category first
              const matched = all.filter((b) => b._id !== blog._id && b.category === blog.category);
              const fallback = all.filter((b) => b._id !== blog._id && b.category !== blog.category);
              const combined = [...matched, ...fallback].slice(0, 2);
              
              if (combined.length === 0) {
                return <p className="text-slate-500 text-xs italic">More articles coming soon!</p>;
              }
              
              return combined.map((recBlog) => (
                <div
                  key={recBlog._id}
                  onClick={() => {
                    navigate(`/blog-${recBlog._id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-200 border-b border-slate-100">
                    <img
                      src={recBlog.imageUrl}
                      alt={recBlog.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      onError={(e) => (e.currentTarget.src = `https://picsum.photos/600/350?random=${recBlog._id}`)}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[9px] bg-[#15A148]/10 text-[#15A148] px-2 py-0.5 rounded-full font-extrabold uppercase">
                        {recBlog.category}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-xs leading-snug line-clamp-2 group-hover:text-[#15A148] transition-all">
                        {recBlog.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-semibold pt-2 border-t border-slate-200/60">
                      <span>{recBlog.publishedAt}</span>
                      <span>{recBlog.readTime}</span>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

      </div>
    </article>
  );
};


// ==========================================================================
// 3️⃣ ADMIN BLOGS: WYSIWYG BLOG POST PUBLISHER & SEO QUALITY AUDITOR
// ==========================================================================

const BlogAdminPage = ({ navigate }: { navigate: (path: string) => void }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("SEO Tips");
  const [readTime, setReadTime] = useState("4 min read");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/600/350?random=10");
  const [availableCategories, setAvailableCategories] = useState<string[]>(["SEO Tips", "AI Storefronts", "Local Business"]);
  
  // SEO Meta fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [seoScore, setSeoScore] = useState(0);

  // Content Selection position tracking for visual rich-text operations
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = getStoredBlogs();
    setBlogs(list);
    const stored = localStorage.getItem("zooda_blog_categories");
    let cats = ["SEO Tips", "AI Storefronts", "Local Business"];
    if (stored) {
      try { cats = JSON.parse(stored); } catch(e){}
    }
    setAvailableCategories(cats);
    if (cats.length > 0) {
      setCategory(cats[0]);
    }
  }, []);

  // Initialize content once initially without cursor jumps
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content === ""]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleEditorChange();
  };

  // Real-time slug auto-generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const cleaned = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
    setSlug(cleaned);
    if (!metaTitle) {
      setMetaTitle(val.slice(0, 60));
    }
  };

  // Real-time SEO Optimization Checker Widget
  useEffect(() => {
    let score = 0;
    const focusKeyword = keywords.trim().split(",")[0]?.trim()?.toLowerCase() || "";

    // Score components:
    // 1. Keyword in Title
    if (focusKeyword && title.toLowerCase().includes(focusKeyword)) score += 15;
    // 2. Keyword in Slug
    if (focusKeyword && slug.toLowerCase().includes(focusKeyword)) score += 15;
    // 3. Meta Description optimal length (120 - 160)
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 20;
    else if (metaDescription.length > 50) score += 10;
    // 4. Images alt tag audit (content includes img)
    if (content.includes("alt=")) score += 15;
    // 5. Links present
    if (content.includes("<a href=")) score += 15;
    // 6. Ordered or unordered list present
    if (content.includes("<ul>") || content.includes("<ol>")) score += 20;

    setSeoScore(score);
  }, [title, slug, content, metaDescription, keywords]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      alert("Please populate all required fields!");
      return;
    }

    const newBlog: BlogPost = {
      _id: `blog-custom-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim() || "untitled-slug",
      category,
      readTime,
      excerpt: excerpt.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || "https://picsum.photos/600/350?random=10",
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      keywords: keywords.trim() || "blog",
      publishedAt: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      author: {
        name: "Zooda Admin",
        avatar: "https://picsum.photos/100/100?random=99",
        role: "Platform Administrator",
        verified: true
      }
    };

    const updated = [newBlog, ...blogs];
    setBlogs(updated);
    saveStoredBlogs(updated);

    alert("🎉 Awesome! Your SEO-optimized blog post has been published successfully!");
    navigate("/blogs");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* BACK NAVIGATION */}
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-1 text-slate-500 hover:text-[#15A148] text-xs font-bold transition-all focus:outline-none"
        >
          <span className="material-icons text-sm">arrow_back</span>
          Back to Blogs Feed
        </button>

        {/* TITLE BLOCK */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 leading-none">
              <span className="material-icons text-[#15A148]">edit_note</span>
              Zooda Blogger Pro Dashboard
            </h1>
            <p className="text-slate-500 text-xs leading-none">Create, optimize, and publish SEO-ready business insights.</p>
          </div>
          
          <button
            onClick={() => {
              if (window.confirm("Restore default mock pre-seeded blogs?")) {
                localStorage.removeItem("zooda_blogs");
                setBlogs(getStoredBlogs());
                alert("Mock database reset successfully!");
                navigate("/blogs");
              }
            }}
            className="text-[10px] text-red-500 font-bold border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
          >
            Reset Database
          </button>
        </div>

        {/* MAIN PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* FORM FIELDS COLUMNS (Lg: 2 columns wide) */}
          <form onSubmit={handlePublish} className="lg:col-span-2 space-y-4">
            
            {/* GENERAL DETAILS */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                1. General Article Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Blog Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Retail Storefront Hacks to Double Traffic"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">URL Slug / Path *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5-retail-storefront-hacks"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Category Tag *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#15A148] focus:bg-white transition"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-[9px] text-slate-400 italic">
                    Note: Approved category tags are administered and managed strictly by platform executives.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center justify-between">
                    <span>Featured Cover Image</span>
                    <span className="text-[9px] text-slate-400 capitalize">URL or Local Upload</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="https://picsum.photos/600/350"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white transition"
                    />
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#15A148] text-[10px] font-bold text-slate-700 cursor-pointer transition-all active:scale-[0.98] shrink-0">
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setImageUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Reading Estimation</label>
                  <input
                    type="text"
                    placeholder="4 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Excerpt / Description snippet *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Write a brief, highly compelling 1-2 sentence description summarizing this article."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white resize-none transition"
                  />
                </div>
              </div>
            </div>

            {/* WYSIWYG DUAL EDITOR BLOCK */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Visual Content Publisher (No HTML tags needed!)
                </h2>
                
                {/* INLINE WYSIWYG BUTTONS BAR */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => execCmd("bold")}
                    title="Bold"
                    className="wysiwyg-toolbar-btn font-extrabold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd("italic")}
                    title="Italic"
                    className="wysiwyg-toolbar-btn italic font-serif"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd("underline")}
                    title="Underline"
                    className="wysiwyg-toolbar-btn underline"
                  >
                    U
                  </button>
                  <span className="h-6 w-px bg-slate-200 mx-1"></span>
                  
                  {/* Preset Colors */}
                  <button
                    type="button"
                    onClick={() => execCmd("foreColor", "#15A148")}
                    title="Brand Green"
                    className="wysiwyg-toolbar-btn text-emerald-600 text-base"
                  >
                    ●
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd("foreColor", "#1b4fd8")}
                    title="Accents Blue"
                    className="wysiwyg-toolbar-btn text-blue-600 text-base"
                  >
                    ●
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd("foreColor", "#ea580c")}
                    title="Action Orange"
                    className="wysiwyg-toolbar-btn text-orange-600 text-base"
                  >
                    ●
                  </button>
                  
                  {/* Full Color Palette Picker */}
                  <div className="flex items-center gap-1 px-1" title="Choose Custom Color">
                    <input
                      type="color"
                      onChange={(e) => execCmd("foreColor", e.target.value)}
                      className="w-4 h-4 rounded-md cursor-pointer border border-slate-300 p-0 bg-transparent overflow-hidden"
                    />
                  </div>

                  <span className="h-6 w-px bg-slate-200 mx-1"></span>

                  {/* Bullet Lists */}
                  <button
                    type="button"
                    onClick={() => execCmd("insertUnorderedList")}
                    title="Unordered List"
                    className="wysiwyg-toolbar-btn"
                  >
                    <span className="material-icons text-sm">format_list_bulleted</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => execCmd("insertOrderedList")}
                    title="Ordered List"
                    className="wysiwyg-toolbar-btn"
                  >
                    <span className="material-icons text-sm">format_list_numbered</span>
                  </button>

                  <span className="h-6 w-px bg-slate-200 mx-1"></span>

                  {/* Link Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt("Enter hyperlink URL (e.g. https://google.com):", "https://");
                      if (url) {
                        execCmd("createLink", url);
                      }
                    }}
                    title="Add Hyperlink"
                    className="wysiwyg-toolbar-btn"
                  >
                    <span className="material-icons text-sm">link</span>
                  </button>

                  {/* Table Inserter Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const colsInput = prompt("Enter number of columns:", "3");
                      if (colsInput === null) return;
                      const rowsInput = prompt("Enter number of rows:", "3");
                      if (rowsInput === null) return;
                      
                      const cols = parseInt(colsInput) || 3;
                      const rows = parseInt(rowsInput) || 3;
                      
                      if (cols > 0 && rows > 0) {
                        let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #000000; font-size: 13px;">`;
                        tableHtml += `<tbody>`;
                        for (let r = 0; r < rows; r++) {
                          tableHtml += `<tr>`;
                          for (let c = 0; c < cols; c++) {
                            if (r === 0) {
                              tableHtml += `<th style="border: 1px solid #000000; padding: 10px; color: #ffffff; background-color: #245d8c; font-weight: bold; text-align: left;">Header</th>`;
                            } else if (c === 0) {
                              tableHtml += `<td style="border: 1px solid #000000; padding: 10px; color: #000000; background-color: #ffffff; font-weight: bold;">Label</td>`;
                            } else {
                              tableHtml += `<td style="border: 1px solid #000000; padding: 10px; color: #000000; background-color: #ffffff;">Cell</td>`;
                            }
                          }
                          tableHtml += `</tr>`;
                        }
                        tableHtml += `</tbody></table><p>&nbsp;</p>`;
                        
                        execCmd("insertHTML", tableHtml);
                      }
                    }}
                    title="Insert Custom Table"
                    className="wysiwyg-toolbar-btn"
                  >
                    <span className="material-icons text-sm">grid_on</span>
                  </button>

                  {/* Local computer or mobile image upload tool */}
                  <label className="wysiwyg-toolbar-btn cursor-pointer flex items-center justify-center">
                    <span className="material-icons text-sm">image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              const imgHtml = `<img src="${reader.result}" alt="Visual Image" style="width: 100%; max-width: 100%; border-radius: 12px; margin: 12px 0; object-fit: cover;" class="blog-img-full" />`;
                              execCmd("insertHTML", imgHtml);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <div
                  id="wysiwyg-visual-editor-user"
                  ref={editorRef}
                  contentEditable={true}
                  onBlur={handleEditorChange}
                  onInput={handleEditorChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white min-h-[250px] max-h-[450px] overflow-y-auto leading-relaxed space-y-4"
                  style={{ whiteSpace: "pre-wrap" }}
                  placeholder="Write your beautiful article content here..."
                />
                <p className="text-[10px] text-slate-500">
                  Visual Mode Active: Type naturally, highlight words to format, and click toolbar buttons. No HTML tags required!
                </p>
              </div>
            </div>

            {/* SEO OPTIMIZER METADATA */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                3. SEO Optimization Meta Tags
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Focus Keyword *</label>
                    <span className="text-[9px] text-slate-500">(Primary keyword used for dynamic audit score)</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. storefront hacks"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Meta Title Tag</label>
                    <span className="text-[9px] text-slate-500">({metaTitle.length}/60 chars)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Vijayawada Shop Marketing Guides | Zooda"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value.slice(0, 60))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Meta Description Tag</label>
                    <span className={`text-[9px] font-bold ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-emerald-600' : 'text-slate-500'}`}>
                      ({metaDescription.length} chars - optimal: 120-160)
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Write a precise description showing up in search engine page layouts. Optimal length 120-160 characters."
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#15A148] focus:bg-white resize-none transition"
                  />
                </div>
              </div>
            </div>

            {/* ACTION PUBLISH */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#15A148] hover:bg-[#118039] text-white px-8 py-3 rounded-xl text-xs font-bold shadow-md transition-all focus:outline-none"
              >
                Publish Article
              </button>
            </div>
          </form>

          {/* DYNAMIC SEO AUDIT SCOREBOARD & PREVIEW */}
          <div className="space-y-6">
            
            {/* SEO SCOREBOARD PANEL */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">
                SEO Audit Scoreboard
              </h3>

              {/* Score bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">SEO Quality Score:</span>
                  <span className={`text-lg font-extrabold ${seoScore >= 80 ? 'text-emerald-600' : (seoScore >= 50 ? 'text-orange-500' : 'text-red-500')}`}>
                    {seoScore} / 100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${seoScore}%` }}
                    className={`h-full transition-all duration-300 ${seoScore >= 80 ? 'bg-[#15A148]' : (seoScore >= 50 ? 'bg-orange-500' : 'bg-red-500')}`}
                  ></div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className={`material-icons text-sm ${title.toLowerCase().includes(keywords.toLowerCase()) && keywords.trim() !== "" ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {title.toLowerCase().includes(keywords.toLowerCase()) && keywords.trim() !== "" ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-slate-700">Keyword in Article Title</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className={`material-icons text-sm ${slug.toLowerCase().includes(keywords.toLowerCase()) && keywords.trim() !== "" ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {slug.toLowerCase().includes(keywords.toLowerCase()) && keywords.trim() !== "" ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-slate-700">Keyword in URL Path Slug</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className={`material-icons text-sm ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {metaDescription.length >= 120 && metaDescription.length <= 160 ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-slate-700">Meta Description length (120-160)</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className={`material-icons text-sm ${content.includes("alt=") ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {content.includes("alt=") ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-slate-700">Image Alt tags for search indexes</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className={`material-icons text-sm ${content.includes("<a href=") ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {content.includes("<a href=") ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-slate-700">Outbound hyperlinks integrated</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className={`material-icons text-sm ${content.includes("<ul>") || content.includes("<ol>") ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {content.includes("<ul>") || content.includes("<ol>") ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-slate-700">Structured lists (Bullet/Numbered)</span>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW WRAPPER */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">
                Live Article Preview
              </h3>
              
              <div className="border border-slate-100 rounded-xl p-4 max-h-[300px] overflow-y-auto bg-slate-50 scrollbar-thin">
                {title ? (
                  <h2 className="text-sm font-extrabold text-slate-900 mb-2 leading-tight">{title}</h2>
                ) : (
                  <p className="text-[10px] italic text-slate-400">Untitled article heading...</p>
                )}
                
                {imageUrl && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-4">
                    <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                  </div>
                )}

                <div 
                  className="blog-content-wrapper text-[10px] leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: content || "<p className='italic text-slate-400'>Start typing in the publisher pane to see interactive live rendered HTML preview here...</p>" }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


// ---------------- MAIN APP COMPONENT ----------------
const App = () => {
  const { currentPath, navigate, routeParams } = useHistoryRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allPromotions, setAllPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedPost, setSelectedPost] = useState<{
    post: Post;
    company: Company;
  } | null>(null);

  const [activePopupCompany, setActivePopupCompany] = useState<Company | null>(null);
  const [popupCompaniesList, setPopupCompaniesList] = useState<Company[]>([]);

  const handleOpenWebsitePopup = (company: Company) => {
    setActivePopupCompany(company);
    setPopupCompaniesList(allCompanies);
  };

  const handlePrevPopupCompany = () => {
    if (!activePopupCompany) return;
    const list = popupCompaniesList.length > 0 ? popupCompaniesList : allCompanies;
    const idx = list.findIndex(c => c._id === activePopupCompany._id);
    if (idx > 0) {
      setActivePopupCompany(list[idx - 1]);
    } else {
      setActivePopupCompany(list[list.length - 1]);
    }
  };

  const handleNextPopupCompany = () => {
    if (!activePopupCompany) return;
    const list = popupCompaniesList.length > 0 ? popupCompaniesList : allCompanies;
    const idx = list.findIndex(c => c._id === activePopupCompany._id);
    if (idx !== -1 && idx < list.length - 1) {
      setActivePopupCompany(list[idx + 1]);
    } else {
      setActivePopupCompany(list[0]);
    }
  };

  const isSearchActive = routeParams.type === "search";
  const selectedCompanyId =
    routeParams.type === "company" ? routeParams.id : null;
  const selectedPostId = routeParams.type === "post" ? routeParams.id : null;

  const selectedCompany =
    allCompanies.find((c) => c._id === selectedCompanyId || slugify(c.name || c.businessName) === selectedCompanyId) || null;

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener("user-state-change", loadUser);
    return () => window.removeEventListener("user-state-change", loadUser);
  }, []);

  useEffect(() => {
    if (routeParams.type === "posts") {
      document.body.classList.add("no-scroll-page");
      document.documentElement.classList.add("no-scroll-page");
    } else {
      document.body.classList.remove("no-scroll-page");
      document.documentElement.classList.remove("no-scroll-page");
    }
    return () => {
      document.body.classList.remove("no-scroll-page");
      document.documentElement.classList.remove("no-scroll-page");
    };
  }, [routeParams.type]);

  useEffect(() => {
    const loadAllPromotions = async () => {
      try {
        const promotions = await getActivePromotions();
        setAllPromotions(promotions);
      } catch (err) {
        console.error("Error loading all promotions:", err);
      }
    };

    loadAllPromotions();
  }, []);

  useEffect(() => {
    if (routeParams.type !== "post") {
      setSelectedPost(null);
    }
  }, [routeParams.type]);

  useEffect(() => {
    const loadPostData = async () => {
      if (selectedPostId && !selectedPost) {
        try {
          console.log("Loading post data for:", selectedPostId);

          const postResponse = await axios.get(
            `${API_BASE_URL}/api/post/${selectedPostId}/details`
          );

          if (postResponse.data.success) {
            const post = postResponse.data.post;
            console.log("Post data loaded:", post);

            let company: Company;
            const busId = post.businessId || (post.business && post.business._id) || post.business;

            if (busId && busId !== "unknown") {
              const companyResponse = await axios.get(
                `${API_BASE_URL}/api/companies/${busId}`
              );
              company = companyResponse.data.company;
            } else {
              company = {
                _id: "unknown",
                rank: 0,
                name: "Unknown Business",
                description: "",
                followers: "0",
                trend: "",
                siteUrl: "#",
                logoUrl: "",
                posts: [],
                postCategories: [],
                products: [],
                productCategories: [],
                engagementRate: "0.0",
              };
            }

            setSelectedPost({ post, company });
          }
        } catch (err) {
          console.error("Error loading post data:", err);
        }
      }
    };

    if (selectedPostId) {
      loadPostData();
    }
  }, [selectedPostId, selectedPost]);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const companiesResponse = await fetch(`${API_BASE_URL}/api/business/all`);
        const companiesData = await companiesResponse.json();

        if (Array.isArray(companiesData)) {
          const companiesWithDetails = await Promise.all(
            companiesData.map(async (item, index) => {
              try {
                const productsResponse = await fetch(
                  `${API_BASE_URL}/api/product/${item._id}`
                );
                const productsData = await productsResponse.json();
                const products = productsData.products || [];

                const postsResponse = await fetch(
                  `${API_BASE_URL}/api/post/${item._id}`
                );
                const postsData = await postsResponse.json();
                const posts = postsData.posts || [];

                const totalLikes = posts.reduce(
                  (sum: number, post: Post) => sum + (post.likes || 0),
                  0
                );

                const totalComments = posts.reduce(
                  (sum: number, post: Post) => sum + (post.comments || 0),
                  0
                );

                const totalInteractions = totalLikes + totalComments;
                const followerCount = parseInt(item.followers) || 1000;

                const engagementRate =
                  followerCount > 0
                    ? ((totalInteractions / followerCount) * 100).toFixed(1)
                    : "0.0";

                return {
                  _id: item._id,
                  rank: index + 1,
                  name: item.businessName || "Unnamed Business",
                  description:
                    item.businessDescription || "No description available",
                  followers: item.followers,
                  trend: "Rising",
                  siteUrl: item.businessWebsite || "#",
                  logoUrl: item.logoUrl,
                  posts: [],
                  postCategories: ["All"],
                  products,
                  productCategories: [
                    "All",
                    ...new Set(products.map((p: Product) => p.category)),
                  ],
                  totalPosts: 0,
                  totalProducts: products.length,
                  engagementRate,
                };
              } catch (error) {
                console.error(`Error loading company ${item._id}:`, error);
                return null;
              }
            })
          );

          const validCompanies = companiesWithDetails.filter(
            Boolean
          ) as Company[];

          setAllCompanies(validCompanies);

          const allProductsList: Product[] = [];
          validCompanies.forEach((company) => {
            company.products.forEach((product) => {
              allProductsList.push({
                ...product,
                companyId: company._id,
                companyName: company.name,
              });
            });
          });

          setAllProducts(allProductsList);
        }
      } catch (err) {
        console.error("Error loading search data:", err);
      }
    };

    loadSearchData();
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      const lowerQuery = query.toLowerCase().trim();
      setSearchQuery(query);

      if (!lowerQuery) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const companyResults = allCompanies
          .filter(
            (company) =>
              company.name.toLowerCase().includes(lowerQuery) ||
              company.description.toLowerCase().includes(lowerQuery)
          )
          .map((company) => ({
            id: company._id,
            name: company.name,
            type: "company" as const,
            imageUrl: company.logoUrl,
          }));

        const productResults = allProducts
          .filter(
            (product) =>
              product.name?.toLowerCase().includes(lowerQuery) ||
              product.category?.toLowerCase().includes(lowerQuery) ||
              product.tags?.some((tag) =>
                tag.toLowerCase().includes(lowerQuery)
              )
          )
          .map((product) => ({
            id: product._id || `product-${Math.random()}`,
            name: product.name || product.category,
            type: "product" as const,
            companyId: product.companyId,
            companyName: product.companyName,
            imageUrl: product.imageUrl,
            price: product.price,
          }));

        const combinedResults = [...companyResults, ...productResults];
        setSearchResults(combinedResults);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [allCompanies, allProducts]
  );

  const handleSelectSearchResult = (result: SearchResult) => {
    if (result.type === "company") {
      navigate(`#company-${slugify(result.name || "business")}`);
    } else if (result.type === "product" && result.companyId) {
      const company = allCompanies.find(c => c._id === result.companyId);
      const nameSlug = company ? slugify(company.name || company.businessName) : slugify(result.companyName || "business");
      navigate(`#company-${nameSlug}`);
      setTimeout(() => {
        const productsTab = document.querySelector(
          '.tab[data-tab="Products"]'
        ) as HTMLElement | null;
        if (productsTab) productsTab.click();
      }, 100);
    }
  };

  const handleSearchClick = () => {
    navigate("#search");
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchBack = () => {
    window.history.back();
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("user-state-change"));
    navigate("/");
  };

  const handleNavClick = (page: string) => {
    switch (page) {
      case "Home":
        navigate("/");
        break;
      case "Profile":
        navigate("/profile");
        break;
      case "Posts":
        navigate("/posts");
        break;
      case "Chats":
        navigate("/chats");
        break;
      case "About":
        navigate("/about");
        break;
     
      default:
        navigate("/");
    }
  };

  const handleProfileClick = () => {
    if (user?.isLoggedIn) {
      navigate("/profile");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSelectCompany = (company: Company) => {
    const nameSlug = slugify(company.name || company.businessName || "business");
    navigate(`/${nameSlug}`);
  };

  const handleSelectPost = (post: Post, company: Company) => {
    console.log("Selecting post:", post._id, "from company:", company._id);
    setSelectedPost({ post, company });
    navigate(`/${getPostUrl(post)}`);
  };

  const handleClaimOffer = (promotion: Promotion) => {
    console.log("Claiming offer:", promotion);

    if (promotion.targetUrl) {
      window.open(promotion.targetUrl, "_blank");
    }

    alert(
      `Offer claimed! ${
        promotion.discountCode
          ? `Use code: ${promotion.discountCode}`
          : promotion.couponCode
          ? `Use code: ${promotion.couponCode}`
          : ""
      }`
    );
  };

  const renderHeader = () => {
    if (isSearchActive) return null;

    return (
      <Header
        user={user || undefined}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onRegister={() => setShowRegisterModal(true)}
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMobileMenuOpen}
        onSearchClick={handleSearchClick}
        onProfileClick={handleProfileClick}
        currentRoute={routeParams.type}
        onLogoClick={() => navigate("/")}
        onBackArrowClick={() => window.history.back()}
        onNavigate={navigate}
      />
    );
  };

  const renderPage = () => {
    console.log(
      "Current route:",
      routeParams.type,
      "selectedPostId:",
      selectedPostId,
      "selectedPost:",
      selectedPost
    );

    if (isSearchActive) {
      return (
        <SearchPage
          searchQuery={searchQuery}
          searchResults={searchResults}
          onSelectSearchResult={handleSelectSearchResult}
          onSearchChange={handleSearch}
          onBack={handleSearchBack}
          loading={searchLoading}
          onVisitSite={handleOpenWebsitePopup}
        />
      );
    }

    if (selectedPostId) {
      if (selectedPost) {
        return (
          <PostDetailPage
            data={selectedPost}
            onBack={() => window.history.back()}
            user={user || undefined}
            onLoginRequest={() => setShowLoginModal(true)}
          />
        );
      }

      return (
        <div className="loading-container">
          <p>Loading post...</p>
        </div>
      );
    }

    if (selectedCompany) {
      return (
        <>
          <ProfilePage
            company={selectedCompany}
            onSelectPost={handleSelectPost}
            user={user || undefined}
            onLoginRequest={() => setShowLoginModal(true)}
            onVisitSite={handleOpenWebsitePopup}
          />
          <Footer navigate={navigate} />
        </>
      );
    }

    switch (routeParams.type) {
      case "profile":
        if (user) {
          return (
            <UserProfilePage
              user={user}
              onBack={() => window.history.back()}
              onSelectCompany={handleSelectCompany}
              onLogout={handleLogout}
              allCompanies={allCompanies}
            />
          );
        }
        return <div className="p-4 text-center">Please log in to view your profile.</div>;

      case "blogs":
        return (
          <BlogsPage
            onSelectBlog={(id) => navigate(`/blog-${id}`)}
            navigate={navigate}
          />
        );

      case "blog-admin":
        return (
          <BlogAdminPage
            navigate={navigate}
          />
        );

      case "blog-detail":
        return (
          <BlogDetailPage
            blogId={routeParams.id || ""}
            navigate={navigate}
          />
        );

      case "posts":
        return (
          <AllPostsPage
            onSelectPost={handleSelectPost}
            user={user || undefined}
            onLoginRequest={() => setShowLoginModal(true)}
            onVisitSite={handleOpenWebsitePopup}
          />
        );

      case "chats":
        return (
          <ChatsPage
            user={user}
            navigateTo={navigate}
            onLoginRequest={() => setShowLoginModal(true)}
          />
        );

      case "about":
        return <AboutPage />;

      case "privacy":
        return <PrivacyPolicyPage />;

      case "terms":
        return <TermsPage />;

      case "contact":
        return <ContactPage />;

      case "home":
      default:
        return (
          <>
            <Banner />
            <CompanyListPage
              onSelectCompany={handleSelectCompany}
              user={user || undefined}
              allPromotions={allPromotions}
              onClaimOffer={handleClaimOffer}
              onVisitSite={handleOpenWebsitePopup}
            />
            <Footer navigate={navigate} />
          </>
        );
    }
  };

  return (
    <div className={`app-container page-${routeParams.type || 'home'}`}>
      {!isSearchActive && (
        <nav className="app-nav mobile-only">
          <a
            href="/"
            className={`nav-item ${routeParams.type === "home" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <span className="material-icons">home</span>
            <span className="nav-text">Home</span>
          </a>

          <a
            href="/posts"
            className={`nav-item ${routeParams.type === "posts" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/posts");
            }}
          >
            <span className="material-icons">article</span>
            <span className="nav-text">Posts</span>
          </a>

        
          <a
            href="/chats"
            className={`nav-item ${routeParams.type === "chats" || routeParams.type === "chat" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/chats");
            }}
          >
            <span className="material-icons">chat</span>
            <span className="nav-text">Chats</span>
          </a>

          {user && (
            <a
              href="/profile"
              className={`nav-item ${routeParams.type === "profile" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleProfileClick();
              }}
            >
              <span className="material-icons">account_circle</span>
              <span className="nav-text">My Profile</span>
            </a>
          )}
        </nav>
      )}

      <div className="main-column">
        {renderHeader()}

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activePage={routeParams.type}
          onNavClick={handleNavClick}
          user={user || undefined}
          onLogin={() => {
            setShowLoginModal(true);
            setIsMobileMenuOpen(false);
          }}
          onRegister={() => {
            setShowRegisterModal(true);
            setIsMobileMenuOpen(false);
          }}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
        />

        <div className="main-wrapper">{renderPage()}</div>
      </div>


      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          const limitSlug = localStorage.getItem("zooda_guest_chats_limit_bus_slug");
          if (limitSlug) {
            localStorage.removeItem("zooda_guest_chats_limit_bus_slug");
            navigate(`/${limitSlug}`);
          }
        }}
        onLogin={handleLogin}
        onOpenRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
          const limitSlug = localStorage.getItem("zooda_guest_chats_limit_bus_slug");
          if (limitSlug) {
            localStorage.removeItem("zooda_guest_chats_limit_bus_slug");
            navigate(`/${limitSlug}`);
          }
        }}
        onRegister={handleRegister}
        onOpenLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      {activePopupCompany && (
        <div 
          className="sp-website-popup-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActivePopupCompany(null)}
        >
          {/* Floating Navigation Buttons on Outer Left/Right Sides */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPopupCompany();
            }}
            className="floating-nav-btn prev-btn"
            aria-label="Previous Page"
          >
            <span className="material-icons">chevron_left</span>
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleNextPopupCompany();
            }}
            className="floating-nav-btn next-btn"
            aria-label="Next Page"
          >
            <span className="material-icons">chevron_right</span>
          </button>

          <div 
            className="sp-website-popup-modal"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '1200px',
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Navigation Toolbar */}
            <div 
              className="popup-header-toolbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff'
              }}
            >
              {/* Left Side: Prev/Next & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Navigation Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handlePrevPopupCompany}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>chevron_left</span>
                  </button>
                  
                  <button 
                    onClick={handleNextPopupCompany}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>chevron_right</span>
                  </button>
                </div>
 
                {/* Company Branding */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {activePopupCompany.logoUrl && (
                    <img 
                      src={activePopupCompany.logoUrl} 
                      alt="Logo" 
                      className="popup-header-logo"
                      style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain', background: '#f8fafc', padding: '2px', border: '1px solid #e2e8f0' }} 
                    />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="popup-header-title" style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {activePopupCompany.name || activePopupCompany.businessName}
                    </h3>
                    <span className="popup-header-cat" style={{ fontSize: '11px', color: '#64748b' }}>
                      {activePopupCompany.businessCategory || "Business Page"}
                    </span>
                  </div>
                </div>
              </div>
 
              {/* Right Side: External Link & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a 
                  href={getFormattedUrl(activePopupCompany.siteUrl || activePopupCompany.website)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="popup-header-link"
                  style={{
                    fontSize: '12px',
                    color: '#15A148',
                    textDecoration: 'none',
                    fontWeight: 600,
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Open in New Tab
                  <span className="material-icons" style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>open_in_new</span>
                </a>
 
                <button 
                  onClick={() => setActivePopupCompany(null)}
                  className="popup-header-close-btn"
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>close</span>
                </button>
              </div>
            </div>

            {/* Embed Helper Bar */}
            <div 
              className="popup-embed-helper-bar"
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.12)',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#15A148',
                fontSize: '11.5px',
                fontWeight: 600
              }}
            >
              <span className="material-icons" style={{ fontSize: '15px', color: '#15A148' }}>info</span>
              <span>
                Tip: If secure official pages (like NASA) restrict direct embedding, click the "Open in New Tab" button on the right to browse directly.
              </span>
            </div>

            {/* Iframe Viewport */}
            <div className="popup-iframe-container" style={{ flex: 1, position: 'relative', background: '#ffffff' }}>
              <iframe 
                src={getFormattedUrl(activePopupCompany.siteUrl || activePopupCompany.website)} 
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: '#ffffff'
                }}
                title={activePopupCompany.name || activePopupCompany.businessName}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// Add CSS styles
const promotionStyles = `
.promotion-banner {
  position: relative;
  width: 100%;
  background: #059669;
  border-radius: 12px;
  margin: 12px 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.promotion-banner:hover {
  transform: translateY(-2px);
}

.banner-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #000000 !important;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 16px;
  color: white;
}

.banner-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 16px;
}

.banner-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.banner-info p {
  margin: 0 0 8px 0;
  font-size: 14px;
  opacity: 0.9;
}

.discount-code {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.promotion-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.promotion-popup-content {
  background: white;
  border-radius: 16px;
  max-width: 450px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: popupEnter 0.3s ease-out;
}

.promotion-popup-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.promotion-popup-body {
  padding: 20px;
  text-align: center;
  color: #333;
}

.promotion-popup-body h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
}

.promotion-popup-body p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.promotion-popup-claim-btn {
  background: #15A148;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  width: 100%;
}

@keyframes popupEnter {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = promotionStyles;
  document.head.appendChild(styleSheet);
}

// ---------------- MOUNT REACT APP ----------------
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;


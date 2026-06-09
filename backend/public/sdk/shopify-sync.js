/**
 * Zooda Shopify Sync Engine
 * Auto-syncs product details when visitors browse products on Shopify stores.
 */
(function() {
  console.log("🚀 Zooda Shopify Sync Engine Initialized");

  // Retrieve current script source to dynamically resolve the API base URL
  var scriptTag = document.currentScript;
  var apiBaseUrl = "https://zooda.vercel.app";
  if (scriptTag && scriptTag.src) {
    try {
      var scriptUrl = new URL(scriptTag.src);
      // Strip /sdk/shopify-sync.js or similar
      apiBaseUrl = scriptUrl.origin;
    } catch (e) {
      console.warn("Failed to parse script source URL, falling back to default API URL", e);
    }
  }

  // Ensure config is present
  var config = window.ZoodaConfig || {};
  var apiKey = config.apiKey;

  if (!apiKey) {
    console.error("❌ Zooda Shopify Sync Error: Missing window.ZoodaConfig.apiKey configuration.");
    return;
  }

  // Check if we are on a product page
  var pathname = window.location.pathname;
  if (pathname.indexOf("/products/") !== -1) {
    var cleanProductJsonUrl = pathname.replace(/\/$/, "") + ".js";
    
    console.log("🔍 Product page detected, loading metadata from: " + cleanProductJsonUrl);

    fetch(cleanProductJsonUrl)
      .then(function(res) {
        if (!res.ok) throw new Error("Shopify returned HTTP status " + res.status);
        return res.json();
      })
      .then(function(product) {
        if (!product || !product.title) {
          console.error("❌ Invalid product JSON metadata parsed.");
          return;
        }

        // Map Shopify JSON representation to Zooda sync payload
        var payload = {
          apiKey: apiKey,
          title: product.title,
          description: product.description || "",
          price: product.price ? (parseFloat(product.price) / 100) : 0, // Shopify price is in cents
          sku: (product.variants && product.variants[0] && product.variants[0].sku) ? product.variants[0].sku : String(product.id),
          imageUrl: product.featured_image || (product.images && product.images[0]) || "",
          category: product.type || "Shopify",
          productLink: window.location.href
        };

        console.log("📤 Pushing Shopify product to Zooda Hub...", payload.title);

        return fetch(apiBaseUrl + "/api/client/sync-custom-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      })
      .then(function(res) {
        if (res) return res.json();
      })
      .then(function(data) {
        if (data && data.success) {
          console.log("✅ Zooda Sync Successful: Product synced to hub.");
        } else if (data) {
          console.warn("⚠️ Zooda Sync Warning: " + (data.message || "Unknown error."));
        }
      })
      .catch(function(err) {
        console.error("❌ Zooda Shopify Sync Failed:", err);
      });
  } else {
    console.log("ℹ️ Zooda Sync: Not a product details page. Skipping sync.");
  }
})();

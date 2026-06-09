/**
 * Zooda Custom Integration Sync SDK
 * Provides a simple method for custom websites to sync products.
 */
(function() {
  console.log("🚀 Zooda Custom Sync Engine Initialized");

  // Retrieve current script source to dynamically resolve the API base URL
  var scriptTag = document.currentScript;
  var apiBaseUrl = "https://api.zooda.in";
  if (scriptTag && scriptTag.src) {
    try {
      var scriptUrl = new URL(scriptTag.src);
      apiBaseUrl = scriptUrl.origin;
    } catch (e) {
      console.warn("Failed to parse script source URL, falling back to default API URL", e);
    }
  }

  // Expose global method
  window.ZoodaSyncProduct = function(productData) {
    var config = window.ZoodaConfig || {};
    var apiKey = config.apiKey;

    if (!apiKey) {
      console.error("❌ Zooda Custom Sync Error: Missing window.ZoodaConfig.apiKey configuration.");
      return Promise.reject("Missing Zooda API Key configuration");
    }

    if (!productData || !productData.title) {
      console.error("❌ Zooda Custom Sync Error: Product data must contain a 'title' field.");
      return Promise.reject("Invalid product data");
    }

    var payload = {
      apiKey: apiKey,
      title: productData.title,
      description: productData.description || "",
      price: parseFloat(productData.price || 0),
      sku: productData.sku || "",
      imageUrl: productData.imageUrl || productData.image || "",
      category: productData.category || "Custom SDK",
      productLink: productData.productLink || window.location.href
    };

    console.log("📤 Pushing custom product to Zooda Hub...", payload.title);

    return fetch(apiBaseUrl + "/api/client/sync-custom-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      if (data && data.success) {
        console.log("✅ Zooda Sync Successful: Product synced to hub.");
        return data;
      } else {
        throw new Error(data ? data.message : "Unknown backend response");
      }
    })
    .catch(function(err) {
      console.error("❌ Zooda Custom Sync Failed:", err);
      throw err;
    });
  };
})();

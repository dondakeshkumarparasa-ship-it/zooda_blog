const fs = require('fs');
const path = require('path');

// Hostinger API URL
const HOSTINGER_API = 'https://api.zooda.in/api';

async function run() {
  try {
    console.log("Starting backup process from Hostinger...");

    // Create a backup directory specifically for the data files
    const backupDir = path.join(__dirname, 'hostinger-backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    console.log(`Backups will be saved to: ${backupDir}\n`);

    // Helper for fetch JSON
    async function fetchJson(url) {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return await res.json();
    }

    // 1. Fetch Categories
    console.log("--- 1. FETCHING CATEGORIES ---");
    const categories = await fetchJson(`${HOSTINGER_API}/admin/categories`);
    console.log(`Fetched ${categories.length} categories.`);
    
    fs.writeFileSync(
      path.join(backupDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log("Saved categories.json.\n");

    // 2. Fetch all businesses list
    console.log("--- 2. FETCHING BUSINESS LIST ---");
    const businessesSummary = await fetchJson(`${HOSTINGER_API}/business/all`);
    console.log(`Fetched ${businessesSummary.length} businesses.`);

    fs.writeFileSync(
      path.join(backupDir, 'businesses_list_summary.json'),
      JSON.stringify(businessesSummary, null, 2)
    );
    console.log("Saved businesses_list_summary.json.\n");

    // Lists to accumulate details
    const allBusinessesDetails = [];
    const allUsers = [];
    const allProducts = [];
    const allPosts = [];

    let successCount = 0;
    let failCount = 0;

    console.log("--- 3. FETCHING DETAILS FOR ALL BUSINESSES ---");
    for (let i = 0; i < businessesSummary.length; i++) {
      const bizSummary = businessesSummary[i];
      const bizId = bizSummary._id;
      console.log(`[${i + 1}/${businessesSummary.length}] Downloading: ${bizSummary.businessName} (${bizId})...`);

      try {
        const detailData = await fetchJson(`${HOSTINGER_API}/businesses/${bizId}`);
        if (!detailData.success || !detailData.data) {
          console.error(`  -> Failed to get details for ${bizId}`);
          failCount++;
          continue;
        }

        const { business, products, reviews } = detailData.data;

        // Save detailed business
        allBusinessesDetails.push(business);

        // Extract associated user if available
        if (business.user) {
          const userData = business.user;
          if (userData && typeof userData === 'object' && userData._id) {
            allUsers.push({
              businessName: business.businessName,
              businessId: business._id,
              ...userData
            });
          }
        }

        // Extract products
        if (products && Array.isArray(products)) {
          for (const prod of products) {
            allProducts.push({
              businessName: business.businessName,
              businessId: business._id,
              ...prod
            });
          }
        }

        // Extract posts (reviews)
        if (reviews && Array.isArray(reviews)) {
          for (const post of reviews) {
            allPosts.push({
              businessName: business.businessName,
              businessId: business._id,
              ...post
            });
          }
        }

        successCount++;
      } catch (err) {
        console.error(`  -> Error downloading business ${bizId}:`, err.message);
        failCount++;
      }

      // 100ms throttle delay
      await new Promise(r => setTimeout(r, 100));
    }

    // Save final accumulated data backups
    fs.writeFileSync(
      path.join(backupDir, 'businesses_details.json'),
      JSON.stringify(allBusinessesDetails, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, 'users.json'),
      JSON.stringify(allUsers, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, 'products.json'),
      JSON.stringify(allProducts, null, 2)
    );
    fs.writeFileSync(
      path.join(backupDir, 'posts.json'),
      JSON.stringify(allPosts, null, 2)
    );

    console.log("\n=================================");
    console.log("Data copy completed successfully!");
    console.log(`Success: ${successCount} businesses details saved`);
    console.log(`Failed: ${failCount} businesses details failed`);
    console.log(`Files generated in: ${backupDir}`);
    console.log("- categories.json (Categories details)");
    console.log("- businesses_list_summary.json (Quick summary list)");
    console.log("- businesses_details.json (Full profiles of all businesses)");
    console.log("- users.json (Owners' profile names & emails)");
    console.log("- products.json (Products catalogs)");
    console.log("- posts.json (Social and blog posts)");
    console.log("=================================");

  } catch (error) {
    console.error("Backup fatal error:", error);
  }
}

run();

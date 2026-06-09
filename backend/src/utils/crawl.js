// backend/lib/crawl.js ✅ FULL UPDATED (minor robustness: follow redirects, accept html/text)
const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");

const DEFAULT_UA = "Mozilla/5.0 (ZoodaBot/1.0)";
const ASSET_EXT_RE =
  /\.(jpg|jpeg|png|gif|svg|webp|ico|pdf|zip|rar|7z|mp4|mp3|wav|avi|mov|mkv|css|js|json|xml)$/i;

const BAD_PATH_RE =
  /(\/(wp-admin|wp-login|admin|login|signin|signup|register|cart|checkout|account|my-account|privacy|terms|cookie|logout))(\/|$)/i;

function sameHost(baseUrl, testUrl) {
  try {
    const b = new URL(baseUrl);
    const u = new URL(testUrl);
    return b.host === u.host;
  } catch {
    return false;
  }
}

function normalizeUrl(u, baseForRelative) {
  try {
    const url = baseForRelative ? new URL(u, baseForRelative) : new URL(u);
    url.hash = "";

    const drop = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "ref",
      "ref_src",
    ];
    drop.forEach((k) => url.searchParams.delete(k));

    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    return url.toString();
  } catch {
    return null;
  }
}

function isSkippableLink(href) {
  if (!href) return true;
  const h = String(href).trim().toLowerCase();
  if (!h) return true;
  if (h.startsWith("#")) return true;
  if (h.startsWith("mailto:") || h.startsWith("tel:") || h.startsWith("sms:")) return true;
  if (h.startsWith("javascript:")) return true;
  return false;
}

function looksLikeAsset(urlStr) {
  try {
    const u = new URL(urlStr);
    return ASSET_EXT_RE.test(u.pathname);
  } catch {
    return true;
  }
}

function looksLikeBadPath(urlStr) {
  try {
    const u = new URL(urlStr);
    return BAD_PATH_RE.test(u.pathname);
  } catch {
    return true;
  }
}

function hashText(s) {
  return crypto.createHash("sha1").update(String(s || "")).digest("hex");
}

async function getRobotsRules(baseUrl, userAgent = DEFAULT_UA) {
  try {
    const base = new URL(baseUrl);
    const robotsUrl = `${base.protocol}//${base.host}/robots.txt`;

    const res = await axios.get(robotsUrl, {
      timeout: 8000,
      headers: { "User-Agent": userAgent },
      validateStatus: (s) => s >= 200 && s < 500,
    });

    if (!res.data || typeof res.data !== "string") return { allow: [], disallow: [] };

    const lines = res.data
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.split("#")[0].trim());

    let inStar = false;
    const allow = [];
    const disallow = [];

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith("user-agent:")) {
        const ua = line.split(":")[1]?.trim() || "";
        inStar = ua === "*" || userAgent.toLowerCase().includes(ua.toLowerCase());
        continue;
      }
      if (!inStar) continue;

      if (lower.startsWith("allow:")) {
        const p = line.split(":")[1]?.trim();
        if (p) allow.push(p);
      }
      if (lower.startsWith("disallow:")) {
        const p = line.split(":")[1]?.trim();
        if (p) disallow.push(p);
      }
    }

    return { allow, disallow };
  } catch {
    return { allow: [], disallow: [] };
  }
}

function isBlockedByRobots(pathname, rules) {
  const { allow = [], disallow = [] } = rules || {};

  const matchPrefix = (rulesArr) =>
    rulesArr
      .filter((p) => p !== "/")
      .filter((p) => pathname.startsWith(p))
      .sort((a, b) => b.length - a.length)[0];

  const bestDisallow = matchPrefix(disallow);
  const bestAllow = matchPrefix(allow);

  if (!bestDisallow) return false;
  if (bestAllow && bestAllow.length >= bestDisallow.length) return false;
  return true;
}

function extractCleanText($) {
  $("[aria-hidden='true'], [hidden]").remove();
  $("[style*='display:none'], [style*='visibility:hidden']").remove();

  $("script, style, nav, footer, header, noscript, svg, canvas, iframe").remove();
  $("[role='navigation'], [role='banner'], [role='contentinfo']").remove();
  $("form, button, input, select, textarea").remove();

  let $root = $("main");
  if ($root.length === 0) $root = $("article");
  if ($root.length === 0) $root = $("body");

  $root.find("aside, .sidebar, .menu, .nav, .footer, .header").remove();

  return $root.text().replace(/\s+/g, " ").trim();
}

function extractHeadings($) {
  const hs = [];
  ["h1", "h2", "h3"].forEach((tag) => {
    $(tag).each((_, el) => {
      const t = $(el).text().replace(/\s+/g, " ").trim();
      if (t && t.length <= 120) hs.push(t);
    });
  });
  return [...new Set(hs)].slice(0, 30);
}

async function crawlWebsite(baseUrl, options = {}) {
  const {
    maxPages = 25,
    maxDepth = 3,
    timeoutMs = 15000,
    userAgent = DEFAULT_UA,
    minTextLength = 200,
  } = options;

  const start = normalizeUrl(baseUrl);
  if (!start) return [];

  const robots = await getRobotsRules(start, userAgent);

  const visited = new Set();
  const contentHashes = new Set();
  const queue = [{ url: start, depth: 0 }];
  const pages = [];

  while (queue.length && pages.length < maxPages) {
    const item = queue.shift();
    if (!item) continue;

    const currentUrl = item.url;
    const depth = item.depth;

    if (!currentUrl || visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const u = new URL(currentUrl);
      if (!sameHost(start, currentUrl)) continue;
      if (looksLikeAsset(currentUrl)) continue;
      if (looksLikeBadPath(currentUrl)) continue;
      if (isBlockedByRobots(u.pathname, robots)) continue;

      const res = await axios.get(currentUrl, {
        timeout: timeoutMs,
        maxRedirects: 5,
        headers: {
          "User-Agent": userAgent,
          Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
        },
        validateStatus: (s) => s >= 200 && s < 400,
      });

      const html = res.data;
      const $ = cheerio.load(html);

      const title = $("title").text().replace(/\s+/g, " ").trim();
      const description =
        $('meta[name="description"]').attr("content")?.replace(/\s+/g, " ").trim() || "";

      const headings = extractHeadings($);
      const text = extractCleanText($);

      const contentKey = hashText(text.slice(0, 4000));
      if (!contentHashes.has(contentKey)) {
        contentHashes.add(contentKey);

        const combined = [title, description, headings.join(" "), text].join("\n").trim();
        if (combined.replace(/\s+/g, " ").length >= minTextLength) {
          pages.push({
            url: currentUrl,
            title,
            description,
            headings,
            text: combined,
          });
        }
      }

      if (depth < maxDepth) {
        $("a[href]").each((_, el) => {
          const href = $(el).attr("href");
          if (isSkippableLink(href)) return;

          const normalized = normalizeUrl(href, currentUrl);
          if (!normalized) return;

          if (!sameHost(start, normalized)) return;
          if (visited.has(normalized)) return;
          if (looksLikeAsset(normalized)) return;
          if (looksLikeBadPath(normalized)) return;

          try {
            const uu = new URL(normalized);
            if (isBlockedByRobots(uu.pathname, robots)) return;
          } catch {
            return;
          }

          queue.push({ url: normalized, depth: depth + 1 });
        });
      }
    } catch {
      // ignore
    }
  }

  return pages;
}

module.exports = { crawlWebsite };
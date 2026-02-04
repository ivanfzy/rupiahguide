// src/config/seo.ts
// SEO Configuration - aligned with messaging.ts
// All descriptions flow from BRAND.promise and SITE_IDENTITY

// =============================================================================
// SITE NAME CONFIG (Deklarasikan dulu agar bisa digunakan di SEO_CONFIG)
// =============================================================================

// Site name configuration for Google Search visibility
// Aligned with SITE_IDENTITY in messaging.ts
// See: https://developers.google.com/search/docs/appearance/site-names
export const SITE_NAME_CONFIG = {
  // Primary site name - used in search results
  // Matches SITE_IDENTITY.name
  primary: "RupiahGuide",
  
  // Alternative names for context
  // Matches SITE_IDENTITY.tagline variations
  alternatives: [
    "RupiahGuide - Indonesia Travel Money",
    "RupiahGuide - Your Indonesia Travel Money Companion",
  ],
  
  // Title templates for different page types
  // Pattern: [Page Title] - [Site Name]
  titleTemplates: {
    home: "Indonesia Travel Money Guide - RupiahGuide",
    blog: "Indonesia Money Tips & Guides - RupiahGuide",
    blogPost: "%s - RupiahGuide Blog",
    default: "%s - RupiahGuide",
  },
};

// =============================================================================
// SITE DESCRIPTIONS
// =============================================================================

// Descriptions in various lengths for reuse across the site
export const SITE_DESCRIPTIONS = {
  // Short: for constrained spaces
  short: "Count Rupiah banknotes.",
  
  // Standard: optimal for meta description
  standard: "Count Indonesian Rupiah banknotes and convert foreign currency to IDR. A simple tool for travelers in Indonesia.",
  
  // Long: for about pages, app stores
  long: "RupiahGuide is a simple tool for counting Indonesian Rupiah banknotes and converting foreign currencies. Useful for travelers visiting Indonesia.",
};

// =============================================================================
// SEO CONFIG
// =============================================================================

export const SEO_CONFIG = {
  // Title configuration aligned with SITE_NAME_CONFIG
  defaultTitle: SITE_NAME_CONFIG.titleTemplates.home,
  titleTemplate: SITE_NAME_CONFIG.titleTemplates.default,
  
  // Description aligned with SITE_DESCRIPTIONS
  description: SITE_DESCRIPTIONS.standard,
  shortDescription: SITE_DESCRIPTIONS.short,
  longDescription: SITE_DESCRIPTIONS.long,
  
  // Site identity
  url: "https://rupiahguide.com",
  siteName: SITE_NAME_CONFIG.primary,
  
  // Visual identity
  themeColor: "#f97316", // orange-500
  
  // Note: OpenGraph disabled per request
};

// =============================================================================
// SCHEMA.ORG GENERATORS
// =============================================================================

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RupiahGuide",
  "alternateName": ["Rupiah Guide", "Indonesia Travel Money Guide"],
  "url": SEO_CONFIG.url,
  "logo": `${SEO_CONFIG.url}/logo.svg`,
  "description": SITE_DESCRIPTIONS.standard,
  "sameAs": [
    // Add social media URLs when available
    // "https://twitter.com/rupiahguide",
    // "https://facebook.com/rupiahguide",
  ],
});

export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "RupiahGuide",
  "alternateName": ["RupiahGuide", "Indonesia Travel Money Guide", "Visual guide to Indonesian Rupiah banknotes"],
  "url": SEO_CONFIG.url,
  "description": SITE_DESCRIPTIONS.standard,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SEO_CONFIG.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  },
  "inLanguage": ["en", "id"],
});

export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url,
  })),
});

export const createArticleSchema = ({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = "RupiahGuide",
  image,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": description,
  "url": url,
  "datePublished": datePublished || new Date().toISOString(),
  "dateModified": dateModified || datePublished || new Date().toISOString(),
  "author": {
    "@type": (author === "RupiahGuide") ? "Organization" : "Person",
    "name": author,
    ...(author === "RupiahGuide" && { url: SEO_CONFIG.url }),
  },
  "publisher": {
    "@type": "Organization",
    "name": "RupiahGuide",
    "logo": {
      "@type": "ImageObject",
      "url": `${SEO_CONFIG.url}/logo.svg`,
    },
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url,
  },
  ...(image && {
    "image": {
      "@type": "ImageObject",
      "url": image,
    },
  }),
});

// Legacy exports for backward compatibility
export const SCHEMA_ORG = {
  organization: createOrganizationSchema(),
  website: createWebsiteSchema(),
};

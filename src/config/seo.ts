// src/config/seo.ts

export const SEO_CONFIG = {
  defaultTitle: "RupiahGuide - Indonesia Money Guide",
  titleTemplate: "%s - RupiahGuide",
  description: "Visual guide to Indonesian Rupiah banknotes.",
  url: "https://rupiahguide.com", // Ganti dengan domain asli nanti
  siteName: "RupiahGuide",
  twitter: {
    cardType: "summary_large_image",
    handle: "@rupiahguide",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rupiahguide.com",
    site_name: "RupiahGuide",
    images: [
      {
        url: "https://rupiahguide.com/og-image.jpg", // Pastikan buat gambar ini nanti
        width: 1200,
        height: 630,
        alt: "RupiahGuide Preview",
      },
    ],
  },
};

export const SCHEMA_ORG = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RupiahGuide",
    url: SEO_CONFIG.url,
    logo: `${SEO_CONFIG.url}/logo.svg`,
  },
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RupiahGuide",
    alternateName: "Visual guide to Indonesian Rupiah banknotes",
    url: SEO_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_CONFIG.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }
};

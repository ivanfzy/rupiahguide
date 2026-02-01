// src/config/seo.ts

export const SEO_CONFIG = {
  defaultTitle: "RupiahGuide - Indonesia Currency Converter & Guide for Tourists",
  titleTemplate: "%s - RupiahGuide",
  description: "The ultimate currency companion for tourists in Indonesia. Visualize IDR banknotes, calculate cash easily, and get real-time exchange rates to avoid scams.",
  url: "https://rupiahguide.com", // Ganti dengan domain asli nanti
  siteName: "RupiahGuide",
  twitter: {
    handle: "@rupiahguide",
    site: "@rupiahguide",
    cardType: "summary_large_image",
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
    sameAs: [
      "https://twitter.com/rupiahguide",
      "https://instagram.com/rupiahguide"
    ]
  },
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RupiahGuide",
    url: SEO_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_CONFIG.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }
};

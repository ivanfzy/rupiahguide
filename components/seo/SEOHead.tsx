import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '../../src/config/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string; // e.g., "/blog/post-slug" - will be combined with base URL
  noIndex?: boolean; // Set to true for pages that shouldn't be indexed
  schema?: object; // For JSON-LD
  imageUrl?: string; // Open Graph image URL
  type?: 'website' | 'article'; // Open Graph type
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  canonicalPath, 
  noIndex = false,
  schema,
  imageUrl,
  type = 'website'
}) => {
  const siteTitle = title 
    ? SEO_CONFIG.titleTemplate.replace('%s', title) 
    : SEO_CONFIG.defaultTitle;
  
  const metaDescription = description || SEO_CONFIG.description;
  
  // Proper canonical URL construction
  // Removes trailing slashes and ensures consistency
  const canonicalUrl = canonicalPath 
    ? `${SEO_CONFIG.url}${canonicalPath.replace(/\/$/, '')}`
    : SEO_CONFIG.url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta Tag */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Theme Color for Mobile Browsers */}
      <meta name="theme-color" content={SEO_CONFIG.themeColor} />
      <meta name="msapplication-TileColor" content={SEO_CONFIG.themeColor} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content="RupiahGuide" />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {/* JSON-LD Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;

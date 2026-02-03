import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '../../src/config/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string; // e.g., "/blog/post-slug" - will be combined with base URL
  noIndex?: boolean; // Set to true for pages that shouldn't be indexed
  schema?: object; // For JSON-LD
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  canonicalPath, 
  noIndex = false,
  schema
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
      
      {/* Note: OpenGraph and Twitter Cards disabled per project requirements */}

      {/* JSON-LD Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Analytics (Disabled by default) */}
      {/* Google Analytics (GA4)
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </script>
      */}
    </Helmet>
  );
};

export default SEOHead;

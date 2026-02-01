import React from 'react';
import { Helmet } from 'react-helmet';
import { SEO_CONFIG } from '../../src/config/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  schema?: object; // Untuk JSON-LD
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogType = 'website', 
  ogImage, 
  twitterCard,
  schema
}) => {
  const siteTitle = title 
    ? SEO_CONFIG.titleTemplate.replace('%s', title) 
    : SEO_CONFIG.defaultTitle;
  
  const metaDescription = description || SEO_CONFIG.description;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const socialImage = ogImage || SEO_CONFIG.openGraph.images[0].url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard || SEO_CONFIG.twitter.cardType} />
      <meta name="twitter:creator" content={SEO_CONFIG.twitter.handle} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />

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
      {/* Statcounter
      <script type="text/javascript">
        {`
          var sc_project=12345678; 
          var sc_invisible=1; 
          var sc_security="xxxxxxxx"; 
        `}
      </script>
      <script type="text/javascript" src="https://www.statcounter.com/counter/counter.js" async></script>
      <noscript>
        {`
          <div class="statcounter"><a title="Web Analytics" href="https://statcounter.com/" target="_blank"><img class="statcounter" src="https://c.statcounter.com/12345678/0/xxxxxxxx/1/" alt="Web Analytics" referrerPolicy="no-referrer-when-downgrade"></a></div>
        `}
      </noscript>
      */}
    </Helmet>
  );
};

export default SEOHead;

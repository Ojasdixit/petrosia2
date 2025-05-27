import React from 'react';
import { Helmet } from 'react-helmet';

type SeoTagsProps = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'service' | 'product';
  city?: string;
  schemaType?: 'LocalBusiness' | 'Service' | 'Product' | 'Article' | 'BlogPosting' | 'WebPage';
  serviceName?: string;
  serviceDescription?: string;
  servicePriceRange?: string;
  articlePublishedDate?: string;
  articleModifiedDate?: string;
  articleAuthor?: string;
};

/**
 * Enhanced SeoTags component for managing page metadata for SEO with local SEO optimization
 * Includes schema.org markup for better search engine understanding
 */
const SeoTags: React.FC<SeoTagsProps> = ({
  title = 'Petrosia - India\'s Ultimate Pet Marketplace',
  description = 'Find your perfect pet companion and access quality pet services across India. Petrosia offers pet adoption, pet care services, and expert advice for pet owners.',
  keywords = 'pets, pet adoption, pet services, dog, cat, pet india, pet shop, pet care, pet grooming, pet walking, pet boarding',
  image = 'https://petrosia.in/images/logo.png',
  url = 'https://petrosia.in',
  type = 'website',
  city = '',
  schemaType = 'LocalBusiness',
  serviceName = '',
  serviceDescription = '',
  servicePriceRange = '₹500 - ₹2,500',
  articlePublishedDate = '',
  articleModifiedDate = '',
  articleAuthor = 'Petrosia'
}) => {
  // Generate title with city if provided
  const fullTitle = city ? 
    `${title} in ${city} | Petrosia` : 
    title;
  
  // Generate optimized description with city if provided
  const fullDescription = city ? 
    `${description} Available in ${city} and other major cities across India. Book now!` : 
    description;
  
  // Generate optimized keywords with city if provided
  const fullKeywords = city ? 
    `${keywords}, ${keywords.split(', ').map(k => `${k} ${city}`).join(', ')}, pet services ${city}` : 
    keywords;

  // Build schema.org JSON-LD structured data based on the page type
  let schemaData = {};
  
  // Basic organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Petrosia",
    "url": "https://petrosia.in",
    "logo": "https://petrosia.in/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9887805771",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      "https://www.facebook.com/petrosia.in",
      "https://www.instagram.com/petrosia.in/",
      "https://twitter.com/petrosia_in"
    ]
  };

  // If it's a local business page with city info
  if (schemaType === 'LocalBusiness' && city) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Petrosia Pet Care Services",
      "description": serviceDescription || description,
      "image": image,
      "priceRange": servicePriceRange,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressRegion": city,
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates"
        // City coordinates would be added dynamically
      },
      "telephone": "+91-9887805771",
      "url": url,
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates"
          // City coordinates would be added dynamically
        },
        "geoRadius": "30000"
      }
    };
  }
  
  // If it's a specific service page
  else if (schemaType === 'Service' && serviceName) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceName,
      "description": serviceDescription || description,
      "provider": {
        "@type": "Organization",
        "name": "Petrosia",
        "url": "https://petrosia.in"
      },
      "areaServed": city || "India",
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "INR",
          "price": servicePriceRange
        }
      }
    };
  }
  
  // For blog articles
  else if (schemaType === 'Article' || schemaType === 'BlogPosting') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "headline": title,
      "description": description,
      "image": image,
      "author": {
        "@type": "Person",
        "name": articleAuthor
      },
      "publisher": {
        "@type": "Organization",
        "name": "Petrosia",
        "logo": {
          "@type": "ImageObject",
          "url": "https://petrosia.in/images/logo.png"
        }
      },
      "datePublished": articlePublishedDate || new Date().toISOString(),
      "dateModified": articleModifiedDate || new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };
  }
  
  // Default webpage schema
  else {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": url,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Petrosia",
        "url": "https://petrosia.in"
      }
    };
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      
      {/* Open Graph Tags for Social Media */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Viewport and Favicon */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Resource Hints for Performance */}
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      
      {/* Geo Tags for Local SEO */}
      {city && (
        <>
          <meta name="geo.region" content="IN" />
          <meta name="geo.placename" content={city} />
          <meta name="geo.position" content="20.5937;78.9629" /> {/* Default India, would be dynamically set */}
          <meta name="ICBM" content="20.5937, 78.9629" /> {/* Default India, would be dynamically set */}
        </>
      )}
      
      {/* Mobile Specific */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#ff6b00" /> {/* Petrosia brand color */}
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      
      {/* Organization schema always included */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default SeoTags;
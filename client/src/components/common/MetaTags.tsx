import React from 'react';
import { Helmet } from 'react-helmet';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'Petrosia - India\'s Ultimate Pet Marketplace',
  description = 'Find your perfect pet companion and access quality pet services across India. Petrosia offers pet adoption, pet care services, and expert advice for pet owners.',
  keywords = 'pets, pet adoption, pet services, dog, cat, pet india, pet shop, pet care, pet grooming, pet walking, pet boarding',
  image = 'https://petrosia.in/images/logo.png',
  url = 'https://petrosia.in',
  type = 'website'
}) => {
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language */}
      <meta property="og:locale" content="en_IN" />
      
      {/* Icons */}
      <link rel="icon" href="/favicon.ico" />

      {/* DNS prefetch and preconnect */}
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />

      {/* Resource hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </Helmet>
  );
};

export default MetaTags;
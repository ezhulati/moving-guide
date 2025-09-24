import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  schema?: Record<string, any>;
}

const defaultDescription = "Connect electricity for your Texas move instantly. Get same-day power, instant proof for apartments, and save an average of $350/year.";
const defaultOgImage = "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const SEO: React.FC<SEOProps> = ({
  title,
  description = defaultDescription,
  canonicalUrl,
  ogType = 'website',
  ogImage = defaultOgImage,
  schema,
}) => {
  const siteTitle = "Texas Power Mover Guide";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  // Generate structured data for better SEO
  const getStructuredData = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteTitle,
      url: 'https://texaspowermover.com',
      description: defaultDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://texaspowermover.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };
    
    // Merge with custom schema if provided
    return schema ? { ...baseSchema, ...schema } : baseSchema;
  };
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image\" content={ogImage} />}
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image\" content={ogImage} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563EB" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect to improve performance */}
      <link rel="preconnect" href="https://images.pexels.com" />
    </Helmet>
  );
};

export default SEO;
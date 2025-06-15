
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOService } from '@/lib/seo';

interface UseSEOOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  structuredData?: object;
}

export const useSEO = (customSEO?: UseSEOOptions) => {
  const location = useLocation();

  useEffect(() => {
    // Get default SEO data based on current route
    const defaultSEO = SEOService.getPageSEOData(location.pathname);
    
    // Merge with custom SEO data if provided
    const seoData = {
      ...defaultSEO,
      ...customSEO,
      url: `https://matex-health-network.lovable.app${location.pathname}`
    };

    // Update page SEO
    SEOService.updatePageSEO(seoData);
  }, [location.pathname, customSEO]);

  return {
    updateSEO: (newSEO: UseSEOOptions) => {
      const defaultSEO = SEOService.getPageSEOData(location.pathname);
      const seoData = {
        ...defaultSEO,
        ...newSEO,
        url: `https://matex-health-network.lovable.app${location.pathname}`
      };
      SEOService.updatePageSEO(seoData);
    }
  };
};

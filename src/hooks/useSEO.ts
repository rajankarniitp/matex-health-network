
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
      url: `https://matex-health-network.lovable.app${location.pathname}`,
      image: customSEO?.image || defaultSEO.image || 'https://matex-health-network.lovable.app/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png'
    };

    // Update page SEO
    SEOService.updatePageSEO(seoData);
    
    // Update page title for better UX
    document.title = seoData.title 
      ? `${seoData.title} | DocMateX - India's Premier Medical Network` 
      : 'DocMateX - India\'s Premier Medical Networking Platform | Connect, Collaborate & Advance Healthcare';
  }, [location.pathname, customSEO]);

  return {
    updateSEO: (newSEO: UseSEOOptions) => {
      const defaultSEO = SEOService.getPageSEOData(location.pathname);
      const seoData = {
        ...defaultSEO,
        ...newSEO,
        url: `https://matex-health-network.lovable.app${location.pathname}`,
        image: newSEO?.image || defaultSEO.image || 'https://matex-health-network.lovable.app/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png'
      };
      SEOService.updatePageSEO(seoData);
    }
  };
};

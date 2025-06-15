interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export class SEOService {
  private static updateMetaTag(name: string, content: string, property?: boolean) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      if (property) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  private static updateStructuredData(data: object) {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]#dynamic-seo');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'dynamic-seo';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  static updatePageSEO(data: SEOData) {
    const baseUrl = 'https://matex-health-network.lovable.app';
    const defaultTitle = 'DocMateX - Connect, Collaborate & Advance Healthcare';
    const defaultDescription = 'Premier online network for doctors, medical researchers, and healthcare professionals';
    const defaultImage = '/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png';

    // Update title
    const title = data.title ? `${data.title} | DocMateX` : defaultTitle;
    document.title = title;

    // Update meta tags
    this.updateMetaTag('description', data.description || defaultDescription);
    if (data.keywords) {
      this.updateMetaTag('keywords', data.keywords);
    }

    // Update Open Graph tags
    this.updateMetaTag('og:title', title, true);
    this.updateMetaTag('og:description', data.description || defaultDescription, true);
    this.updateMetaTag('og:image', data.image || defaultImage, true);
    this.updateMetaTag('og:url', data.url || baseUrl, true);
    this.updateMetaTag('og:type', data.type || 'website', true);

    // Update Twitter tags
    this.updateMetaTag('twitter:title', title);
    this.updateMetaTag('twitter:description', data.description || defaultDescription);
    this.updateMetaTag('twitter:image', data.image || defaultImage);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', data.url || baseUrl);

    // Update structured data if provided
    if (data.structuredData) {
      this.updateStructuredData(data.structuredData);
    }
  }

  static getPageSEOData(pathname: string): SEOData {
    const seoData: Record<string, SEOData> = {
      '/': {
        title: 'Home',
        description: 'Join the premier network for healthcare professionals. Connect with doctors, share research, collaborate on case studies, and advance medicine together.',
        keywords: 'doctor network, medical professionals, healthcare collaboration, medical research',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "DocMateX",
          "description": "Premier online network for doctors, medical researchers, and healthcare professionals",
          "url": "https://matex-health-network.lovable.app/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://matex-health-network.lovable.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      },
      '/feed': {
        title: 'Medical Feed',
        description: 'Stay updated with the latest medical discussions, case studies, and professional insights from healthcare experts worldwide.',
        keywords: 'medical feed, healthcare news, medical discussions, case studies'
      },
      '/research': {
        title: 'Research Hub',
        description: 'Discover and share cutting-edge medical research papers, clinical studies, and scientific publications with the global healthcare community.',
        keywords: 'medical research, clinical studies, research papers, scientific publications, medical journals'
      },
      '/search': {
        title: 'Search',
        description: 'Find healthcare professionals, medical research, events, and case studies. Connect with experts in your field of medicine.',
        keywords: 'search doctors, find medical professionals, healthcare experts, medical research search'
      },
      '/mates': {
        title: 'Professional Network',
        description: 'Connect with fellow healthcare professionals, build your medical network, and collaborate with doctors worldwide.',
        keywords: 'medical network, doctor connections, healthcare professionals, medical colleagues'
      },
      '/messages': {
        title: 'Messages',
        description: 'Secure messaging platform for healthcare professionals to discuss cases, share insights, and collaborate privately.',
        keywords: 'medical messaging, healthcare communication, secure messaging, professional chat'
      },
      '/events': {
        title: 'Medical Events',
        description: 'Discover medical conferences, webinars, CME courses, and professional development opportunities for healthcare providers.',
        keywords: 'medical conferences, CME events, healthcare webinars, medical education'
      },
      '/jobs': {
        title: 'Healthcare Jobs',
        description: 'Find your next career opportunity in healthcare. Browse medical jobs, physician positions, and healthcare career opportunities.',
        keywords: 'medical jobs, physician careers, healthcare employment, doctor positions'
      },
      '/mentorship': {
        title: 'Medical Mentorship',
        description: 'Connect with experienced medical mentors or become a mentor yourself. Advance your medical career through professional guidance.',
        keywords: 'medical mentorship, healthcare mentoring, physician guidance, medical career development'
      },
      '/case-studies': {
        title: 'Case Studies',
        description: 'Share and learn from clinical case studies, medical cases, and patient scenarios with healthcare professionals worldwide.',
        keywords: 'medical case studies, clinical cases, patient scenarios, medical education'
      }
    };

    return seoData[pathname] || {};
  }
}

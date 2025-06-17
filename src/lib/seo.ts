
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
    const defaultTitle = 'DocMateX - India\'s Premier Medical Networking Platform | Connect, Collaborate & Advance Healthcare';
    const defaultDescription = 'Join India\'s most trusted medical networking platform. Connect with 50K+ verified healthcare professionals, share research, collaborate on case studies, and advance your medical career. Secure HIPAA compliant platform for doctors, medical researchers, and healthcare experts.';
    const defaultImage = `${baseUrl}/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png`;

    // Update title with better SEO
    const title = data.title ? `${data.title} | DocMateX - India's Premier Medical Network` : defaultTitle;
    document.title = title;

    // Update comprehensive meta tags
    this.updateMetaTag('description', data.description || defaultDescription);
    this.updateMetaTag('keywords', data.keywords || 'medical network India, healthcare professionals network, doctor networking platform, medical research collaboration, HIPAA compliant medical platform, verified doctors network, medical case studies, healthcare jobs India, medical mentorship, clinical research platform, Indian medical community, physician network, medical education platform, healthcare innovation India');
    this.updateMetaTag('author', 'DocMateX Team');
    this.updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    this.updateMetaTag('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    this.updateMetaTag('bingbot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Language and locale
    this.updateMetaTag('language', 'English');
    
    // Mobile optimization
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    this.updateMetaTag('mobile-web-app-capable', 'yes');
    this.updateMetaTag('apple-mobile-web-app-capable', 'yes');
    this.updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    this.updateMetaTag('apple-mobile-web-app-title', 'DocMateX');
    
    // Theme and branding
    this.updateMetaTag('theme-color', '#2563eb');
    this.updateMetaTag('msapplication-TileColor', '#2563eb');
    this.updateMetaTag('application-name', 'DocMateX');

    // Open Graph tags for social sharing
    this.updateMetaTag('og:type', data.type || 'website', true);
    this.updateMetaTag('og:site_name', 'DocMateX', true);
    this.updateMetaTag('og:title', title, true);
    this.updateMetaTag('og:description', data.description || defaultDescription, true);
    this.updateMetaTag('og:image', data.image || defaultImage, true);
    this.updateMetaTag('og:image:secure_url', data.image || defaultImage, true);
    this.updateMetaTag('og:image:width', '1200', true);
    this.updateMetaTag('og:image:height', '630', true);
    this.updateMetaTag('og:image:alt', 'DocMateX - India\'s Premier Medical Networking Platform', true);
    this.updateMetaTag('og:url', data.url || baseUrl, true);
    this.updateMetaTag('og:locale', 'en_US', true);
    this.updateMetaTag('og:locale:alternate', 'hi_IN', true);

    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:site', '@docmatex');
    this.updateMetaTag('twitter:creator', '@docmatex');
    this.updateMetaTag('twitter:title', title);
    this.updateMetaTag('twitter:description', data.description || defaultDescription);
    this.updateMetaTag('twitter:image', data.image || defaultImage);
    this.updateMetaTag('twitter:image:alt', 'DocMateX - India\'s Premier Medical Networking Platform');

    // LinkedIn specific
    this.updateMetaTag('linkedin:owner', 'DocMateX');

    // Additional SEO tags
    this.updateMetaTag('rating', 'General');
    this.updateMetaTag('distribution', 'Global');
    this.updateMetaTag('revisit-after', '7 days');
    this.updateMetaTag('expires', 'never');

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', data.url || baseUrl);

    // Add alternate languages
    let alternateLang = document.querySelector('link[rel="alternate"][hreflang="hi"]') as HTMLLinkElement;
    if (!alternateLang) {
      alternateLang = document.createElement('link');
      alternateLang.setAttribute('rel', 'alternate');
      alternateLang.setAttribute('hreflang', 'hi');
      document.head.appendChild(alternateLang);
    }
    alternateLang.setAttribute('href', `${data.url || baseUrl}?lang=hi`);

    // Update structured data if provided
    if (data.structuredData) {
      this.updateStructuredData(data.structuredData);
    }
  }

  static getPageSEOData(pathname: string): SEOData {
    const baseUrl = 'https://matex-health-network.lovable.app';
    const defaultImage = `${baseUrl}/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png`;
    
    const seoData: Record<string, SEOData> = {
      '/': {
        title: 'Home - Premier Medical Networking Platform',
        description: 'Join India\'s most trusted medical networking platform with 50K+ verified healthcare professionals. Connect, collaborate, and advance your medical career with DocMateX - the premier platform for doctors, medical researchers, and healthcare experts.',
        keywords: 'medical network India, healthcare professionals India, doctor networking, medical research platform, verified doctors network, HIPAA compliant medical platform, medical collaboration India, healthcare innovation, physician network India, medical education platform',
        image: defaultImage,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "DocMateX",
          "description": "India's premier online network for doctors, medical researchers, and healthcare professionals",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": defaultImage,
            "width": 1200,
            "height": 630
          },
          "sameAs": [
            "https://twitter.com/docmatex",
            "https://linkedin.com/company/docmatex",
            "https://facebook.com/docmatex"
          ],
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "DocMateX",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": defaultImage
            }
          }
        }
      },
      '/feed': {
        title: 'Medical Feed - Latest Healthcare Discussions',
        description: 'Stay updated with latest medical discussions, case studies, and insights from India\'s top healthcare professionals. Join meaningful conversations with verified doctors and medical experts.',
        keywords: 'medical feed India, healthcare news, medical discussions, case studies, medical insights, doctor conversations, healthcare updates India',
        image: defaultImage
      },
      '/research': {
        title: 'Research Hub - Medical Research Collaboration',
        description: 'Discover cutting-edge medical research, collaborate on clinical studies, and share scientific publications with India\'s leading healthcare research community.',
        keywords: 'medical research India, clinical studies, research collaboration, medical journals, scientific publications, healthcare research network',
        image: defaultImage
      },
      '/mates': {
        title: 'Professional Network - Connect with Healthcare Experts',
        description: 'Build your medical professional network with verified healthcare experts across India. Connect with doctors, specialists, and medical researchers in your field.',
        keywords: 'medical network, healthcare professionals India, doctor connections, medical colleagues, specialist network, verified doctors',
        image: defaultImage
      },
      '/jobs': {
        title: 'Healthcare Jobs - Medical Career Opportunities',
        description: 'Find your next medical career opportunity. Browse verified healthcare jobs, physician positions, and medical career opportunities across India.',
        keywords: 'medical jobs India, healthcare careers, physician jobs, doctor positions, medical employment, healthcare recruitment India',
        image: defaultImage
      },
      '/events': {
        title: 'Medical Events - Conferences & CME Programs',
        description: 'Discover medical conferences, CME courses, webinars, and professional development opportunities for healthcare providers across India.',
        keywords: 'medical conferences India, CME events, healthcare webinars, medical education, continuing medical education, medical training programs',
        image: defaultImage
      },
      '/login': {
        title: 'Login - Access Your Medical Network',
        description: 'Login to DocMateX and access India\'s premier medical networking platform. Connect with verified healthcare professionals and advance your medical career.',
        keywords: 'medical platform login, healthcare professional login, doctor network access, medical community login',
        image: defaultImage
      },
      '/signup': {
        title: 'Join DocMateX - Register for Medical Network',
        description: 'Join India\'s most trusted medical networking platform. Register now to connect with 50K+ verified healthcare professionals and advance your medical career.',
        keywords: 'join medical network, healthcare professional registration, doctor signup, medical platform registration India',
        image: defaultImage
      }
    };

    return seoData[pathname] || {
      title: 'DocMateX - India\'s Premier Medical Network',
      description: 'Connect with verified healthcare professionals on India\'s most trusted medical networking platform.',
      keywords: 'medical network India, healthcare professionals, doctor networking',
      image: defaultImage
    };
  }
}

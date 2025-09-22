
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/layout/Footer';
import { useSEO } from '@/hooks/useSEO';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced SEO optimization for home page
  useSEO({
    title: 'Home - Premier Medical Networking Platform',
    description: 'Join India\'s most trusted medical networking platform with 50K+ verified healthcare professionals. Connect, collaborate, and advance your medical career with DocMateX - the premier platform for doctors, medical researchers, and healthcare experts.',
    keywords: 'medical network India, healthcare professionals India, doctor networking, medical research platform, verified doctors network, HIPAA compliant medical platform, medical collaboration India, healthcare innovation, physician network India, medical education platform, clinical research, medical mentorship, healthcare jobs India, medical case studies',
    image: 'https://matex-health-network.lovable.app/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "DocMateX",
      "description": "India's premier online network for doctors, medical researchers, and healthcare professionals",
      "url": "https://matex-health-network.lovable.app/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://matex-health-network.lovable.app/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png",
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
        "target": "https://matex-health-network.lovable.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "DocMateX",
        "url": "https://matex-health-network.lovable.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://matex-health-network.lovable.app/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png"
        }
      }
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('docmatex_token');
    if (token) {
      setIsAuthenticated(true);
      setTimeout(() => {
        navigate('/feed');
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  // Semantic page wrapper for SEO & accessibility - fully responsive
  const page = (
    <div className="min-h-screen relative flex flex-col">
      {/* Responsive tiled background with better mobile optimization */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 opacity-15 sm:opacity-20 dark:opacity-8 dark:sm:opacity-10"
        style={{
          backgroundImage: `url('/lovable-uploads/2d1a9ec6-c93c-4135-985c-6be34cfa1141.png')`,
          backgroundSize: '200px 200px sm:300px sm:300px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}
      />
      {/* Accessible overlay for contrast with responsive gradients */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95"
      />
      {/* Main content for SEO & accessibility with responsive design */}
      <main className="relative z-10 flex-1 flex flex-col">
        <header className="w-full">
          <Navbar />
        </header>
        <section aria-label="Hero" className="w-full">
          <Hero />
        </section>
        <section aria-label="Features" className="w-full">
          <Features />
        </section>
        <section aria-label="Statistics" className="w-full">
          <Stats />
        </section>
        <section aria-label="Testimonials" className="w-full">
          <Testimonials />
        </section>
        <footer className="w-full mt-auto">
          <Footer />
        </footer>
      </main>
    </div>
  );

  // Show landing page for everyone initially (same for all modes)
  if (isLoading && !isAuthenticated) {
    return page;
  }

  return page;
};

export default Index;

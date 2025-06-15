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

  // SEO optimization for home page
  useSEO({
    title: 'Home',
    description: 'Join the premier network for healthcare professionals. Connect with doctors, share research, collaborate on case studies, and advance medicine together.',
    keywords: 'doctor network, medical professionals, healthcare collaboration, medical research, case studies, medical mentorship, healthcare jobs',
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
      },
      "publisher": {
        "@type": "Organization",
        "name": "DocMateX",
        "url": "https://matex-health-network.lovable.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lovable.dev/openbraph-image-p98pqg.png"
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

  // Semantic page wrapper for SEO
  const page = (
    <div className="min-h-screen relative flex flex-col">
      {/* Responsive tiled background */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url('/lovable-uploads/2d1a9ec6-c93c-4135-985c-6be34cfa1141.png')`,
          backgroundSize: '300px 300px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}
      />
      {/* Accessible overlay for contrast */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95"
      />
      {/* Main content for SEO & accessibility */}
      <main className="relative z-10 flex-1 flex flex-col">
        <header>
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
        <footer className="w-full">
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

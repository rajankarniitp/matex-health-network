
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('docmatex_token');
    if (token) {
      setIsAuthenticated(true);
      // Redirect to feed after showing landing page briefly
      setTimeout(() => {
        navigate('/feed');
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  // Show landing page for everyone initially
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/daa06cc2-1c0f-419f-bb83-0f4de1e042a2.png')`
          }}
        />
        {/* Light mode overlay */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/85 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <Features />
          <Stats />
          <Testimonials />
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/daa06cc2-1c0f-419f-bb83-0f4de1e042a2.png')`
        }}
      />
      {/* Light mode overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/85 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
};

export default Index;

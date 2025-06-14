
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
        {/* Tiled Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `url('/lovable-uploads/2d1a9ec6-c93c-4135-985c-6be34cfa1141.png')`,
            backgroundSize: '300px 300px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center'
          }}
        />
        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95" />
        
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
      {/* Tiled Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url('/lovable-uploads/2d1a9ec6-c93c-4135-985c-6be34cfa1141.png')`,
          backgroundSize: '300px 300px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}
      />
      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95" />
      
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

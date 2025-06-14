
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

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('docmatex_token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/feed'); // Redirect to feed instead of dashboard
    }
  }, [navigate]);

  if (isAuthenticated) {
    return null; // Will redirect to feed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;

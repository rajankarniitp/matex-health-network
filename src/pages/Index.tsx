
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import Stats from '@/components/home/Stats';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to feed
    if (!loading && user) {
      navigate('/feed');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

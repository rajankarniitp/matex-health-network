
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, BookOpen, Award, Heart, Shield, Globe } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <div className="mb-6 sm:mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Founded by Rajan Kumar Karn, IIT Patna
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tight">
              Welcome to
              <span className="block text-blue-600 mt-1">DocMateX</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              The premier professional network designed exclusively for healthcare professionals, researchers, and medical students. 
              Connect, collaborate, and advance your medical career with verified professionals worldwide.
            </p>
            
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-3 mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">50K+ Professionals</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-3 mb-2">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">100% Verified</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 rounded-full p-3 mb-2">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Global Network</span>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/signup" className="flex-1">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-base">
                    Join DocMateX <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 text-sm sm:text-base">
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-gray-500 text-center lg:text-left">
                Already trusted by healthcare professionals worldwide
              </p>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 lg:mt-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">What makes DocMateX special?</h3>
                    <p className="text-sm text-gray-600">Built specifically for healthcare professionals</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">Mate System</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Connect with verified healthcare professionals through our unique Mate system</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">Knowledge Sharing</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Share clinical cases, research papers, and medical insights</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">Career Growth</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Find opportunities, mentorship, and professional development</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-rose-100 rounded-lg p-2 flex-shrink-0">
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">HIPAA Compliant</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Secure, encrypted platform designed for healthcare communication</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

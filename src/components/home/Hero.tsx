
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, BookOpen, Award, Heart, Shield, Globe, Star, Trophy, UserCheck } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Main Hero Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          {/* Logo and Main Brand */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-white dark:bg-white rounded-xl p-4 sm:p-6 shadow-lg flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
              <img 
                src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                alt="DocMateX Logo" 
                className="h-12 sm:h-16 lg:h-20 w-auto"
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-4 sm:mb-6">
            <span className="text-blue-600 dark:text-blue-400">DocMateX</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 sm:mb-8 max-w-5xl mx-auto leading-relaxed">
            India's Most Trusted Medical Networking & Research Ecosystem
          </p>
          
          <p className="text-base sm:text-lg lg:text-xl text-blue-600 dark:text-blue-400 font-medium mb-8 sm:mb-10">
            India's First Healthcare Professional Networking Platform
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Join DocMateX <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Log In
              </Button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-3">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">50K+</span>
              <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Healthcare Professionals</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 mb-3">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">100%</span>
              <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Verified Profiles</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-4 mb-3">
                <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">100+</span>
              <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Countries</span>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 mb-16 sm:mb-20 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Meet Our Founder
            </h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Rajan Kumar Karn
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium mb-4">
                Alumni, Indian Institute of Technology (IIT) Patna
              </p>
              <div className="flex justify-center items-center gap-2 mb-6">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Engineering Excellence & Healthcare Innovation</span>
              </div>
            </div>
            
            <blockquote className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-8">
              "Healthcare professionals dedicate their lives to saving others, yet they often lack a dedicated platform to connect, collaborate, and grow professionally. DocMateX bridges this gap by creating India's first comprehensive medical networking ecosystem."
            </blockquote>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 sm:p-8">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Vision Behind DocMateX
              </h4>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Born from the vision to revolutionize healthcare collaboration in India, DocMateX was created to empower medical professionals with cutting-edge networking tools, research opportunities, and knowledge sharing capabilities. Our mission is to build a trusted ecosystem where healthcare excellence thrives through meaningful connections.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 sm:p-10 shadow-lg border border-blue-200 dark:border-blue-700">
            <div className="text-center mb-6">
              <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Our Vision
              </h3>
            </div>
            <p className="text-base sm:text-lg text-blue-800 dark:text-blue-200 leading-relaxed text-center">
              To become India's most trusted and comprehensive healthcare professional networking platform, fostering innovation, collaboration, and excellence in medical practice while advancing healthcare research and education across the nation.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 sm:p-10 shadow-lg border border-green-200 dark:border-green-700">
            <div className="text-center mb-6">
              <div className="bg-green-600 dark:bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100 mb-4">
                Our Mission
              </h3>
            </div>
            <p className="text-base sm:text-lg text-green-800 dark:text-green-200 leading-relaxed text-center">
              To empower healthcare professionals with innovative networking tools, facilitate knowledge sharing, enable research collaboration, and create meaningful connections that ultimately improve patient care and advance medical science in India and beyond.
            </p>
          </div>
        </div>

        {/* Why Choose DocMateX */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700 mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose DocMateX?
            </h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
              <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">100% Verified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">All healthcare professionals verified through credential checking</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
              <div className="bg-green-600 dark:bg-green-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">HIPAA Compliant</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure, encrypted platform for healthcare communication</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
              <div className="bg-purple-600 dark:bg-purple-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Research Hub</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Advanced platform for medical research and collaboration</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
              <div className="bg-orange-600 dark:bg-orange-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Mate System</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unique networking system for meaningful professional connections</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
              <div className="bg-red-600 dark:bg-red-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Career Growth</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Opportunities, mentorship, and professional development</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700">
              <div className="bg-teal-600 dark:bg-teal-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Global Reach</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with healthcare professionals worldwide</p>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-8 sm:p-12 text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Medical Career?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of healthcare professionals who trust DocMateX for networking, research collaboration, and career advancement. Your medical journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Join DocMateX Today <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Already a Member? Log In
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-blue-100 text-sm sm:text-base">
            Join the revolution in healthcare networking • Trusted by 50,000+ professionals
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;


import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, BookOpen, Award, Heart, Shield, Globe, Star, Trophy, UserCheck } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-16">
      {/* Enhanced background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-50/50 to-blue-50/30 dark:from-primary/10 dark:via-purple-900/20 dark:to-blue-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,hsl(var(--background))_70%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10">
        {/* Main Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Logo and Main Brand */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-float">
            <div className="card-elegant rounded-2xl p-4 sm:p-6 hover-lift w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
              <img 
                src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                alt="DocMateX Logo" 
                className="h-12 sm:h-16 lg:h-20 w-auto animate-pulse-slow"
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-purple-600 bg-clip-text text-transparent">
              DocMateX
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-foreground/80 mb-6 sm:mb-8 max-w-5xl mx-auto leading-relaxed animate-slide-up">
            India's Most Trusted Medical Networking & Research Ecosystem
          </p>
          
          <p className="text-base sm:text-lg lg:text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-semibold mb-8 sm:mb-10 animate-scale-in">
            India's First Healthcare Professional Networking Platform
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-scale-in">
            <Link to="/signup" className="w-full sm:w-auto max-w-sm">
              <Button size="xl" variant="gradient" className="w-full group">
                Join DocMateX 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto max-w-sm">
              <Button size="xl" variant="glass" className="w-full">
                Already a Member? Log In
              </Button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center max-w-5xl mx-auto">
            <div className="flex flex-col items-center group hover-lift card-elegant p-6 rounded-2xl">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">50K+</span>
              <span className="text-sm sm:text-base font-medium text-muted-foreground">Healthcare Professionals</span>
            </div>
            <div className="flex flex-col items-center group hover-lift card-elegant p-6 rounded-2xl">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">100%</span>
              <span className="text-sm sm:text-base font-medium text-muted-foreground">Verified Profiles</span>
            </div>
            <div className="flex flex-col items-center group hover-lift card-elegant p-6 rounded-2xl">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">100+</span>
              <span className="text-sm sm:text-base font-medium text-muted-foreground">Countries</span>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="card-elegant rounded-3xl p-8 sm:p-12 mb-12 sm:mb-16 hover-lift">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Meet Our Founder
            </h2>
            <div className="w-24 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Founder Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="/lovable-uploads/bd694b09-8f4f-4668-abcb-b8f9bbdf8208.png" 
                      alt="Rajan Kumar Karn - Founder of DocMateX" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-blue-600 dark:bg-blue-500 rounded-full p-4 shadow-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Founder Details */}
              <div className="text-center lg:text-left space-y-6">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                    Rajan Kumar Karn
                  </h3>
                  <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-semibold mb-4">
                    Founder & CEO, DocMateX
                  </p>
                  <div className="flex justify-center lg:justify-start items-center gap-2 mb-4">
                    <Award className="h-6 w-6 text-yellow-500" />
                    <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Alumni, Indian Institute of Technology (IIT) Patna
                    </span>
                  </div>
                </div>
                
                <blockquote className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-blue-600 pl-6">
                  "Healthcare professionals dedicate their lives to saving others, yet they often lack a dedicated platform to connect, collaborate, and grow professionally. DocMateX bridges this gap by creating India's first comprehensive medical networking ecosystem."
                </blockquote>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Vision Behind DocMateX
                  </h4>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Born from the vision to revolutionize healthcare collaboration in India, DocMateX was created to empower medical professionals with cutting-edge networking tools, research opportunities, and knowledge sharing capabilities.
                  </p>
                </div>
              </div>
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
        <div className="text-center gradient-bg rounded-3xl p-8 sm:p-12 text-primary-foreground button-glow hover-lift">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Medical Career?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of healthcare professionals who trust DocMateX for networking, research collaboration, and career advancement. Your medical journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto max-w-sm">
              <Button size="xl" className="w-full bg-white text-primary hover:bg-white/90 group">
                Join DocMateX Today 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto max-w-sm">
              <Button size="xl" variant="glass" className="w-full border-white/30 text-white hover:bg-white/20">
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

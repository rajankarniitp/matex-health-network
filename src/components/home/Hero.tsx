
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, BookOpen, Award, Heart, Shield, Globe, Star, Trophy, UserCheck } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-16 pb-20">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-primary/5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Section */}
        <div className="text-center">
          {/* Logo and Main Brand */}
          <div className="flex justify-center mb-8">
            <div className="professional-card p-6 w-20 h-20 lg:w-24 lg:h-24">
              <img 
                src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                alt="DocMateX Logo" 
                className="h-8 lg:h-12 w-auto"
              />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-primary">DocMateX</span>
          </h1>
          
          <p className="text-xl lg:text-2xl font-medium text-muted-foreground mb-4 max-w-3xl mx-auto">
            Professional Medical Networking Platform
          </p>
          
          <p className="text-lg text-primary font-medium mb-12">
            Connecting Healthcare Professionals Worldwide
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/signup" className="w-full sm:w-auto max-w-sm">
              <Button size="lg" className="w-full">
                Join DocMateX 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto max-w-sm">
              <Button size="lg" variant="outline" className="w-full">
                Member Login
              </Button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="professional-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <span className="text-2xl font-bold text-primary block">50K+</span>
              <span className="text-sm text-muted-foreground">Healthcare Professionals</span>
            </div>
            <div className="professional-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500/10 rounded-full p-3">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <span className="text-2xl font-bold text-green-500 block">100%</span>
              <span className="text-sm text-muted-foreground">Verified Profiles</span>
            </div>
            <div className="professional-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-500/10 rounded-full p-3">
                  <Globe className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-500 block">100+</span>
              <span className="text-sm text-muted-foreground">Countries</span>
            </div>
          </div>
        </div>

        {/* Professional Features Section */}
        <div className="professional-card p-8 lg:p-12 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose DocMateX?
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">100% Verified</h4>
              <p className="text-sm text-muted-foreground">All healthcare professionals verified through credential checking</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-500/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">HIPAA Compliant</h4>
              <p className="text-sm text-muted-foreground">Secure, encrypted platform for healthcare communication</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-500/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Research Hub</h4>
              <p className="text-sm text-muted-foreground">Advanced platform for medical research and collaboration</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-orange-500/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Professional Network</h4>
              <p className="text-sm text-muted-foreground">Connect with verified healthcare professionals worldwide</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-red-500/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Career Growth</h4>
              <p className="text-sm text-muted-foreground">Opportunities, mentorship, and professional development</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-500/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Global Reach</h4>
              <p className="text-sm text-muted-foreground">Connect with healthcare professionals worldwide</p>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="text-center gradient-bg rounded-2xl p-12 text-primary-foreground">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Medical Career?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of healthcare professionals who trust DocMateX for networking and collaboration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto max-w-sm">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                Join DocMateX Today 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto max-w-sm">
              <Button size="lg" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

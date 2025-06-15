
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SimpleNavbar from '@/components/layout/SimpleNavbar';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <SimpleNavbar />
      
      {/* Hero Content */}
      <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Connect with</span>
                <span className="block text-blue-600 dark:text-blue-400">Healthcare Professionals</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 dark:text-gray-300 sm:mt-8 sm:text-xl sm:max-w-xl sm:mx-auto lg:mx-0">
                Join the premier professional network for doctors, nurses, and healthcare workers. 
                Share knowledge, find opportunities, and advance your career in healthcare.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base">
                      Join DocMateX
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-base border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-16">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Nurses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Hospitals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">50+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Countries</div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="/lovable-uploads/84147cf3-76ff-47ed-8414-b86ab0dd0c76.png"
                    alt="Healthcare professionals networking"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                </div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">15K+ Members</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2K+ Jobs</span>
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

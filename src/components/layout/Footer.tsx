
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-2 shadow-lg flex items-center justify-center w-12 h-12">
                <img 
                  src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                  alt="DocMateX Logo" 
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-bold text-white">
                DocMateX
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md text-base leading-relaxed">
              DocMateX is the premier professional network for healthcare professionals, researchers, and medical students. 
              Founded by Rajan Kumar Karn from IIT Patna.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/docmatex/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/docmatex?igsh=MTJoZjJ6YjB1ZGx4ag==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/1BgeBnun58/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/help" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-2 bg-blue-600/20 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <a 
                  href="mailto:docmatex@gmail.com"
                  className="text-gray-300 text-sm hover:text-white transition-colors duration-200"
                >
                  docmatex@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-2 bg-blue-600/20 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <a 
                  href="tel:9229635121"
                  className="text-gray-300 text-sm hover:text-white transition-colors duration-200"
                >
                  +91 92296 35121
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-blue-600/20 rounded-lg mt-0.5">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-gray-300 text-sm">
                  IIT Patna, Bihar, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-400 text-sm text-center lg:text-left">
              © 2024 DocMateX. All rights reserved. Founded by Rajan Kumar Karn, IIT Patna.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 font-medium"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 font-medium"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 font-medium"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

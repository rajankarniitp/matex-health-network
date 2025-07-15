
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import MobileBottomNav from './MobileBottomNav';

// Helper function to check auth
function isLoggedIn() {
  return !!localStorage.getItem('docmatex_token');
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('docmatex_user') || '{}');
  const authenticated = isLoggedIn();

  const handleLogout = () => {
    localStorage.removeItem('docmatex_token');
    localStorage.removeItem('docmatex_user');
    navigate('/login');
  };

  const navigateOrLogin = (path: string) => {
    if (authenticated) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 h-16 sm:h-18">
        {/* Logo - Responsive sizing */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <div className="card-elegant rounded-xl p-2 shadow-sm flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform">
            <img
              src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png"
              alt="DocMateX Logo"
              className="h-6 sm:h-8 w-auto"
            />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            DocMateX
          </span>
        </Link>

        {/* Desktop navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <button
            type="button"
            onClick={() => navigateOrLogin('/mates')}
            className={`px-4 py-2 rounded-lg transition-all text-sm lg:text-base font-medium ${
              location.pathname === '/mates' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105'
            } bg-transparent border-0 cursor-pointer`}
          >
            Mates
          </button>
          <button
            type="button"
            onClick={() => navigateOrLogin('/feed')}
            className={`px-4 py-2 rounded-lg transition-all text-sm lg:text-base font-medium ${
              location.pathname === '/feed' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105'
            } bg-transparent border-0 cursor-pointer`}
          >
            Feed
          </button>
          <button
            type="button"
            onClick={() => navigateOrLogin('/jobs')}
            className={`px-4 py-2 rounded-lg transition-all text-sm lg:text-base font-medium ${
              location.pathname === '/jobs' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105'
            } bg-transparent border-0 cursor-pointer`}
          >
            Jobs
          </button>
          <button
            type="button"
            onClick={() => navigateOrLogin('/doxy-ai')}
            className={`px-4 py-2 rounded-lg transition-all text-sm lg:text-base font-medium ${
              location.pathname === '/doxy-ai' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105'
            } bg-transparent border-0 cursor-pointer`}
          >
            DoxyAI
          </button>
        </div>

        {/* Right side - Auth dependent with responsive design */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-1 h-8 w-8 sm:h-9 sm:w-9">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Profile'} />
                    <AvatarFallback className="text-xs sm:text-sm">{user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 sm:w-44">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user?.name ?? 'Doctor'}</span>
                    <span className="text-xs text-gray-500 truncate">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="text-sm">
                  <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="text-sm">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-sm">
                  <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="gradient" size="sm" className="text-sm px-4 py-2 h-9">
                Login
              </Button>
            </Link>
          )}
          
          {/* Hamburger for mobile - Responsive sizing */}
          <button
            className="inline-flex md:hidden items-center justify-center p-1.5 sm:p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 transition focus:outline-none"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu slide-in - Fully responsive */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`fixed inset-0 bg-black/40 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Sidebar - Responsive width */}
        <div
          className={`fixed top-0 left-0 h-full w-4/5 sm:w-3/5 max-w-sm bg-white dark:bg-gray-900 shadow-lg transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-4 sm:p-6 pt-6 sm:pt-8 space-y-4 sm:space-y-5">
            <Link
              to="/"
              className="py-2 px-2 rounded text-gray-900 dark:text-gray-100 hover:bg-blue-50 font-medium text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/mates"
              className="py-2 px-2 rounded text-gray-900 dark:text-gray-100 hover:bg-blue-50 font-medium text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Mates
            </Link>
            <Link
              to="/feed"
              className="py-2 px-2 rounded text-gray-900 dark:text-gray-100 hover:bg-blue-50 font-medium text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
            <Link
              to="/jobs"
              className="py-2 px-2 rounded text-gray-900 dark:text-gray-100 hover:bg-blue-50 font-medium text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              to="/doxy-ai"
              className="py-2 px-2 rounded text-gray-900 dark:text-gray-100 hover:bg-blue-50 font-medium text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              DoxyAI
            </Link>
            {authenticated && (
              <Link
                to="/profile"
                className="py-2 px-2 rounded text-gray-900 dark:text-gray-100 hover:bg-blue-50 font-medium text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {authenticated ? (
              <button
                className="mt-6 sm:mt-8 text-left text-sm hover:underline text-blue-700"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="mt-6 sm:mt-8 text-left text-sm hover:underline text-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Nav - Only for authenticated users */}
      {authenticated && (
        <div className="md:hidden">
          <MobileBottomNav />
        </div>
      )}
    </nav>
  );
};

export default Navbar;

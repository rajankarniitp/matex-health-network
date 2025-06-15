
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ui/theme-toggle';
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

  const handleLogout = () => {
    localStorage.removeItem('docmatex_token');
    localStorage.removeItem('docmatex_user');
    navigate('/login');
  };

  const navigateOrLogin = (path: string) => {
    if (isLoggedIn()) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const navigationItems = [
    { path: '/mates', label: 'Mates' },
    { path: '/feed', label: 'Feed' },
    { path: '/jobs', label: 'Jobs' },
  ];

  return (
    <>
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
            <div className="rounded-lg p-1.5 shadow-sm flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-blue-700">
              <img
                src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png"
                alt="DocMateX Logo"
                className="h-6 w-auto lg:h-8 brightness-0 invert"
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              DocMateX
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigateOrLogin(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                } min-h-[44px] flex items-center`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications (when logged in) */}
            {isLoggedIn() && (
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            )}

            {/* User Menu */}
            {isLoggedIn() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-1 h-10 w-10 lg:h-11 lg:w-11 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar className="h-8 w-8 lg:h-9 lg:w-9 ring-2 ring-gray-200 dark:ring-gray-700">
                      <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Profile'} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold">
                        {user?.name?.charAt(0) ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-fade-in">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{user?.name ?? 'Doctor'}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 min-h-[44px]"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md min-h-[44px]"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px]"
              aria-label="Open menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu slide-in */}
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'visible' : 'invisible'
          }`}
        >
          {/* Overlay */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl transition-transform transform border-r border-gray-200 dark:border-gray-800 ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <Link
                  to="/"
                  className="flex items-center space-x-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="rounded-lg p-1.5 shadow-sm flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700">
                    <img
                      src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png"
                      alt="DocMateX Logo"
                      className="h-6 w-auto brightness-0 invert"
                    />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    DocMateX
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  ✕
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  <Link
                    to="/"
                    className="block py-3 px-4 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  {navigationItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigateOrLogin(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  
                  {isLoggedIn() && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-800 my-4"></div>
                      <Link
                        to="/profile"
                        className="block py-3 px-4 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block py-3 px-4 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        className="w-full text-left py-3 px-4 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      {isLoggedIn() && (
        <div className="md:hidden">
          <MobileBottomNav />
        </div>
      )}
    </>
  );
};

export default Navbar;

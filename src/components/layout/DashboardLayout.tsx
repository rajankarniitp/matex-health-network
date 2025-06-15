
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import {
  Home,
  Users,
  MessageSquare,
  Briefcase,
  BookOpen,
  FileText,
  Calendar,
  Search,
  Award,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Bell
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Feed', href: '/feed', icon: MessageSquare },
  { name: 'My Mates', href: '/mates', icon: Users },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Research Hub', href: '/research', icon: BookOpen },
  { name: 'Case Studies', href: '/case-studies', icon: FileText },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Mentorship', href: '/mentorship', icon: Award },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('docmatex_token');
    localStorage.removeItem('docmatex_user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('docmatex_user') || '{}');

  const getCurrentPageTitle = () => {
    const currentPage = navigation.find(item => item.href === location.pathname);
    return currentPage?.name || 'DocMateX';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-out md:hidden border-r border-gray-200 dark:border-gray-700 shadow-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg p-2 shadow-sm flex items-center justify-center w-10 h-10">
              <img 
                src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                alt="DocMateX Logo" 
                className="h-6 w-auto"
              />
            </div>
            <span className="text-lg font-bold text-white">
              DocMateX
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                location.pathname === item.href
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-100'
              } group flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 space-x-3 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2.5 shadow-lg flex items-center justify-center w-12 h-12">
                <img 
                  src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                  alt="DocMateX Logo" 
                  className="h-7 w-auto brightness-0 invert"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                DocMateX
              </span>
            </div>
            
            <nav className="flex-1 px-4 bg-white dark:bg-gray-800 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100 shadow-sm border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-100'
                  } group flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-sm`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-sm dark:shadow-gray-700/50 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-18">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 min-w-0 px-4 md:px-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 dark:text-gray-100 truncate">
                  {getCurrentPageTitle()}
                </h1>
              </div>

              <div className="flex items-center space-x-3 lg:space-x-4">
                <NotificationDropdown />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 lg:h-11 lg:w-11 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Avatar className="h-9 w-9 lg:h-10 lg:w-10 ring-2 ring-gray-200 dark:ring-gray-700">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold">
                          {user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl animate-fade-in" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer p-3">
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer p-3">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer p-3">
                        <Shield className="mr-3 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer p-3">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="py-6 lg:py-8">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

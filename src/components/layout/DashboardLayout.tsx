
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
  Shield
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
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('docmatex_user') || '{}');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="bg-white dark:bg-white rounded-lg p-1.5 shadow-sm flex items-center justify-center w-8 h-8">
              <img 
                src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                alt="DocMateX Logo" 
                className="h-6 w-auto"
              />
            </div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              DocMateX
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                location.pathname === item.href
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 space-x-3">
              <div className="bg-white dark:bg-white rounded-lg p-2 shadow-sm flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12">
                <img 
                  src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                  alt="DocMateX Logo" 
                  className="h-7 lg:h-9 w-auto"
                />
              </div>
              <span className="text-base lg:text-lg font-bold text-blue-600 dark:text-blue-400">
                DocMateX
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white dark:bg-gray-800 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
                  } group flex items-center px-2 py-2 text-xs lg:text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 h-4 w-4 lg:h-5 lg:w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-2 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 min-w-0 px-2 md:px-0">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 dark:text-gray-100 truncate">
                  {navigation.find(item => item.href === location.pathname)?.name || 'DocMateX'}
                </h1>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                <NotificationDropdown />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback className="bg-blue-600 text-white dark:bg-blue-500 text-xs sm:text-sm">{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 sm:w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs sm:text-sm font-medium leading-none text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Shield className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-3 sm:py-4 md:py-6">
            <div className="px-2 sm:px-4 md:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

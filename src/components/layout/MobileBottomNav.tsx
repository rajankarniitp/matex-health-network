
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, MessageSquare, Briefcase, User } from 'lucide-react';

const navigationItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Mates', path: '/mates', icon: Users },
  { label: 'Feed', path: '/feed', icon: MessageSquare },
  { label: 'Jobs', path: '/jobs', icon: Briefcase },
  { label: 'Profile', path: '/profile', icon: User },
];

const MobileBottomNav = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 safe-area-bottom md:hidden">
      <div className="flex justify-between items-center px-2 py-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 min-h-[60px] ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon 
                className={`h-5 w-5 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`} 
              />
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'font-semibold' : 'font-normal'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;


import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, MessageSquare, Bot } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { to: '/feed', icon: Home, label: 'Feed' },
    { to: '/mates', icon: Users, label: 'Mates' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/doxy-ai', icon: Bot, label: 'DoxyAI' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

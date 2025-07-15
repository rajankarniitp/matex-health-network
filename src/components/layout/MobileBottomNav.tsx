
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
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50 safe-area-pb">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-3 px-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-primary bg-primary/10 scale-110'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105'
              }`}
            >
              <div className={`relative ${isActive ? 'animate-bounce' : ''}`}>
                <Icon className="h-5 w-5 mb-1" />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
              <span className={`text-xs font-medium truncate transition-all ${
                isActive ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

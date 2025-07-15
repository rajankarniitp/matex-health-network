
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, MessageSquare, Bot } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { 
      to: '/feed', 
      icon: Home, 
      label: 'Home',
      activeColor: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      to: '/mates', 
      icon: Users, 
      label: 'My Network',
      activeColor: 'text-green-600',
      bgColor: 'bg-green-600/10'
    },
    { 
      to: '/jobs', 
      icon: Briefcase, 
      label: 'Jobs',
      activeColor: 'text-orange-600',
      bgColor: 'bg-orange-600/10'
    },
    { 
      to: '/doxy-ai', 
      icon: Bot, 
      label: 'DoxyAI',
      activeColor: 'text-purple-600',
      bgColor: 'bg-purple-600/10'
    },
    { 
      to: '/messages', 
      icon: MessageSquare, 
      label: 'Messaging',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-600/10'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 mobile-nav-glass mobile-nav-shadow z-50">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 nav-gradient-light dark:nav-gradient-dark"></div>
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      
      <div className="relative flex justify-around items-stretch py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`mobile-nav-item ${isActive ? 'active' : ''} flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-300 group relative ${
                isActive
                  ? `${item.activeColor} scale-105`
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
            {
              /* LinkedIn-style icon container */
            }
              <div className={`relative mb-1 p-2 rounded-xl transition-all duration-300 group-hover:scale-110 nav-icon ${
                isActive 
                  ? `${item.bgColor} shadow-lg nav-icon-active` 
                  : 'hover:bg-muted/30 group-hover:bg-muted/50'
              }`}>
                <Icon className={`h-6 w-6 transition-all duration-300 ${
                  isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105'
                }`} />
                
                {/* Enhanced active state indicators */}
                {isActive && (
                  <>
                    {/* Professional notification badge */}
                    <div className="nav-status-badge"></div>
                    
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 rounded-xl bg-current opacity-5 animate-pulse"></div>
                    
                    {/* Modern active ring */}
                    <div className="absolute inset-0 rounded-xl ring-1 ring-current ring-opacity-30"></div>
                  </>
                )}
              </div>
              
              {/* Professional label with better typography */}
              <span className={`text-xs font-medium truncate transition-all duration-300 leading-tight text-center max-w-full px-1 ${
                isActive 
                  ? 'font-semibold drop-shadow-sm' 
                  : 'font-normal group-hover:font-medium'
              }`}>
                {item.label}
              </span>
              
              {/* LinkedIn-style active indicator */}
              {isActive && (
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full nav-active-indicator ${item.activeColor.replace('text-', 'bg-')}`}></div>
              )}
              
              {/* Hover feedback */}
              <div className="absolute inset-0 rounded-xl bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for modern devices */}
      <div className="safe-area-pb bg-background/95 backdrop-blur-sm"></div>
      
      {/* Bottom highlight line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
    </nav>
  );
};

export default MobileBottomNav;


import { NavLink, useLocation } from 'react-router-dom';
import { User, Menu } from 'lucide-react';

const navs = [
  { label: 'Home', path: '/', icon: Menu },
  { label: 'Mates', path: '/mates', icon: User },
  { label: 'Feed', path: '/feed', icon: Menu },
  { label: 'Jobs', path: '/jobs', icon: Menu },
  { label: 'Profile', path: '/profile', icon: User },
];

const MobileBottomNav = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center px-2 py-1 shadow-md md:hidden">
      {navs.map((n) => (
        <NavLink
          key={n.path}
          to={n.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center text-xs px-1 pt-2 pb-1 font-medium ${
              isActive || location.pathname === n.path
                ? 'text-blue-600'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <n.icon className="h-6 w-6 mb-0.5" />
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
};
export default MobileBottomNav;

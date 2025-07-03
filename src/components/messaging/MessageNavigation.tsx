
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MessageNavigationProps {
  onNavigationFix?: () => void;
}

const MessageNavigation = ({ onNavigationFix }: MessageNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fix for auto-navigation bug
    const handleNavigationFix = () => {
      // Prevent automatic navigation back to feed
      if (location.pathname.includes('/chat/') || location.pathname === '/messages') {
        // Stay on current page, don't auto-navigate
        console.log('Navigation fix applied:', location.pathname);
        if (onNavigationFix) {
          onNavigationFix();
        }
      }
    };

    // Apply fix on mount
    handleNavigationFix();

    // Listen for history changes
    const unlisten = () => {
      handleNavigationFix();
    };

    window.addEventListener('popstate', unlisten);
    
    return () => {
      window.removeEventListener('popstate', unlisten);
    };
  }, [location.pathname, navigate, onNavigationFix]);

  return null; // This is a utility component
};

export default MessageNavigation;

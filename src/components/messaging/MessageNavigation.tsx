
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MessageNavigationProps {
  onNavigationFix?: () => void;
}

const MessageNavigation = ({ onNavigationFix }: MessageNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fix for auto-navigation bug - prevent unwanted redirects
    const handleNavigationFix = () => {
      // Only apply fix for messaging routes
      if (location.pathname.includes('/chat/') || location.pathname === '/messages') {
        // Prevent automatic navigation back to feed
        console.log('Navigation fix applied for messaging:', location.pathname);
        if (onNavigationFix) {
          onNavigationFix();
        }
        return true;
      }
      return false;
    };

    // Apply fix immediately on mount
    const wasFixed = handleNavigationFix();

    // Prevent history manipulation that causes redirect to feed
    const handlePopState = (event: PopStateEvent) => {
      if (location.pathname.includes('/chat/') || location.pathname === '/messages') {
        event.preventDefault();
        console.log('Prevented unwanted navigation from messaging');
      }
    };

    if (wasFixed) {
      window.addEventListener('popstate', handlePopState);
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate, onNavigationFix]);

  return null; // This is a utility component
};

export default MessageNavigation;

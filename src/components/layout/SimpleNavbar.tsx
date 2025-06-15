
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SimpleNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="rounded-lg p-1 shadow-sm flex items-center justify-center w-10 h-10">
            <img
              src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png"
              alt="DocMateX Logo"
              className="h-8 w-auto"
            />
          </div>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            DocMateX
          </span>
        </Link>

        {/* Login Button */}
        <Button onClick={() => navigate('/login')} variant="outline">
          Login
        </Button>
      </div>
    </nav>
  );
};

export default SimpleNavbar;

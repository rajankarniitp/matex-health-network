
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, MessageSquare } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(`404 Error: User attempted to access non-existent route: ${location.pathname}`);
  }, [location]);

  const suggestions = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/feed', label: 'Feed', icon: MessageSquare },
    { path: '/mates', label: 'My Mates', icon: Search },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-blue-600">404</span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You tried to access: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Try these instead:</p>
            {suggestions.map((suggestion) => (
              <Link
                key={suggestion.path}
                to={suggestion.path}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <suggestion.icon className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">{suggestion.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link to="/" className="flex-1">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

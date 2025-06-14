
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to home page
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default NotFound;

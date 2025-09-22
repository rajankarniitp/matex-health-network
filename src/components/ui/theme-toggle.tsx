
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={`Current theme: ${theme}. Click to switch.`}
    >
      {actualTheme === 'dark' ? (
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      ) : (
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;

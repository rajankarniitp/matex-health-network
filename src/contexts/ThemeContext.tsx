
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('docmatex_theme');
    return (stored as Theme) || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let resolvedTheme: 'light' | 'dark';

    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }

    root.classList.add(resolvedTheme);
    setActualTheme(resolvedTheme);
    
    // Force a repaint to ensure styles are applied
    root.style.colorScheme = resolvedTheme;
    
    localStorage.setItem('docmatex_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const resolvedTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolvedTheme);
        document.documentElement.style.colorScheme = resolvedTheme;
        setActualTheme(resolvedTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

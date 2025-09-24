import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Function to get the system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Save theme preference to localStorage
  const saveTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('comparepower-theme', newTheme);
    } catch (e) {
      console.error('Could not save theme preference', e);
    }
  };

  // Update theme and save to localStorage
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
    
    const newResolvedTheme = newTheme === 'system' ? getSystemTheme() : newTheme;
    setResolvedTheme(newResolvedTheme);
    
    // Update document classes for tailwind dark mode
    if (newResolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme on first render
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('comparepower-theme') as Theme | null;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        updateTheme(savedTheme);
      } else {
        // If no valid theme is found, use light mode as default
        updateTheme('light');
      }
    } catch (e) {
      // If error, default to light
      updateTheme('light');
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(getSystemTheme());
        if (getSystemTheme() === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: updateTheme,
        resolvedTheme,
        isDark: resolvedTheme === 'dark'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
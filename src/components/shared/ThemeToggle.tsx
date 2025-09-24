import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'button' | 'dropdown';
  showLabel?: boolean;
}

export default function ThemeToggle({ 
  className, 
  variant = 'icon', 
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Avoid hydration mismatch by only rendering after component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            "p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
            className
          )}
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
            <button
              className={cn(
                "flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                theme === 'light' ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-200"
              )}
              onClick={() => {
                setTheme('light');
                setIsDropdownOpen(false);
              }}
            >
              <Sun className="h-4 w-4 mr-2" />
              Light
            </button>
            
            <button
              className={cn(
                "flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                theme === 'dark' ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-200"
              )}
              onClick={() => {
                setTheme('dark');
                setIsDropdownOpen(false);
              }}
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </button>
            
            <button
              className={cn(
                "flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                theme === 'system' ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-200"
              )}
              onClick={() => {
                setTheme('system');
                setIsDropdownOpen(false);
              }}
            >
              <Monitor className="h-4 w-4 mr-2" />
              System
            </button>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={cn(
            "p-2 rounded-md",
            theme === 'light' 
              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400" 
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
          aria-label="Light theme"
        >
          <Sun className="h-4 w-4" />
          {showLabel && <span className="ml-2">Light</span>}
        </button>
        
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={cn(
            "p-2 rounded-md",
            theme === 'dark' 
              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400" 
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
          aria-label="Dark theme"
        >
          <Moon className="h-4 w-4" />
          {showLabel && <span className="ml-2">Dark</span>}
        </button>
        
        <button
          type="button"
          onClick={() => setTheme('system')}
          className={cn(
            "p-2 rounded-md",
            theme === 'system' 
              ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400" 
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
          aria-label="System theme"
        >
          <Monitor className="h-4 w-4" />
          {showLabel && <span className="ml-2">System</span>}
        </button>
      </div>
    );
  }

  // Default icon variant
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
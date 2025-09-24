// This script runs before React to check for existing theme preferences
(function() {
  try {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem('comparepower-theme');
    
    // Apply theme based on preference
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default or light theme
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // If any error, default to light theme
    document.documentElement.classList.remove('dark');
  }
})();
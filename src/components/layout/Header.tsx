import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  // Use ThemeContext instead of props
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center">
            <span className="text-white font-bold">PP</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">PilotPro</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Salary Calculator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

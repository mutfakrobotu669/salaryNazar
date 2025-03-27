import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface UserSettings {
  animationsEnabled: boolean;
  preferredCurrency: string;
  showDetailedBreakdown: boolean;
  colorTheme: string;
}

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  
  // Safely get theme with fallback
  let theme = 'light';
  let toggleTheme = () => {
    console.warn('Theme context not available, using fallback');
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  try {
    // Try to use the theme context, with fallback if it fails
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    console.error('Error accessing theme context:', error);
    // Using fallback values already defined
  }
  
  // Default settings
  const defaultSettings: UserSettings = {
    animationsEnabled: true,
    preferredCurrency: 'TRY',
    showDetailedBreakdown: true,
    colorTheme: 'default',
  };
  
  // Initialize with default settings
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  
  // Track mounting state and update theme
  useEffect(() => {
    setMounted(true);
    setCurrentTheme(theme);
  }, [theme]);
  
  // Load settings from localStorage on client-side only
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [mounted]);
  
  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };
  
  // Available currencies
  const currencies = [
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
  ];
  
  // Color themes
  const colorThemes = [
    { id: 'default', name: 'Default Blue' },
    { id: 'green', name: 'Emerald Green' },
    { id: 'purple', name: 'Royal Purple' },
    { id: 'red', name: 'Ruby Red' },
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Settings panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Settings</h2>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium mb-3">Appearance</h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={currentTheme === 'dark'}
                        onChange={toggleTheme}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                {/* Animation Settings */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium mb-3">Animations</h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Enable Animations</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.animationsEnabled}
                        onChange={() => handleSettingChange('animationsEnabled', !settings.animationsEnabled)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                {/* Currency Settings */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium mb-3">Currency</h3>
                  
                  <div className="mb-3">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preferred Currency
                    </label>
                    <select
                      id="currency"
                      value={settings.preferredCurrency}
                      onChange={(e) => handleSettingChange('preferredCurrency', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Display Settings */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium mb-3">Display</h3>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 dark:text-gray-300">Show Detailed Breakdown</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.showDetailedBreakdown}
                        onChange={() => handleSettingChange('showDetailedBreakdown', !settings.showDetailedBreakdown)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="colorTheme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color Theme
                    </label>
                    <select
                      id="colorTheme"
                      value={settings.colorTheme}
                      onChange={(e) => handleSettingChange('colorTheme', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {colorThemes.map(theme => (
                        <option key={theme.id} value={theme.id}>
                          {theme.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Reset and Save Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const defaultSettings = {
                        animationsEnabled: true,
                        preferredCurrency: 'TRY',
                        showDetailedBreakdown: true,
                        colorTheme: 'default',
                      };
                      setSettings(defaultSettings);
                      localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reset to Default
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserSettings;

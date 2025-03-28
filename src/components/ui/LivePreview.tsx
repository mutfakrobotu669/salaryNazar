import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '../../contexts/CalculatorContext';
import { formatCurrency } from '../../utils/formatters';

const LivePreview = () => {
  // Three possible states: collapsed (just a button), minimized (header only), expanded (full)
  const [displayMode, setDisplayMode] = useState<'collapsed' | 'minimized' | 'expanded'>('minimized');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile and default to collapsed state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, default to collapsed state
      if (mobile && displayMode === 'minimized') {
        setDisplayMode('collapsed');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const { 
    currentStep,
    airline, 
    position, 
    salaryLevel,
    liveCalculation,
    completionPercentage
  } = useCalculator();

  // Only show preview after airline selection and before results page
  if (!airline || currentStep === 4) return null;
  
  // Don't show if we don't have a calculation yet
  if (!liveCalculation) return null;
  
  // Define display names for airline and position
  const airlineName = airline === 'yellow' ? 'Yellow Tail' : 'Blue Tail';
  const positionName = position === 'firstOfficer' ? 'First Officer' : 'Captain';
  
  // If on calculator steps but no airline selected yet, or if on results page, don't show the preview
  if (!airline || currentStep === 4) return null;
  if (!liveCalculation) return null;

  // Handle the collapsed state - just show a small button fixed to the bottom right
  if (displayMode === 'collapsed') {
    return (
      <motion.button
        className="fixed bottom-3 right-3 z-50 bg-primary text-white rounded-full p-2 shadow-lg"
        whileTap={{ scale: 0.95 }}
        onClick={() => setDisplayMode('minimized')}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>
    );
  }
  
  // For minimized or expanded states, show the container
  return (
    <motion.div 
      className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-t-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        bottom: 0,
        right: isMobile ? 0 : '1rem',
        left: isMobile ? 0 : 'auto',
        width: isMobile ? '100%' : '20rem',
        maxHeight: displayMode === 'minimized' ? '2.75rem' : (isMobile ? '40vh' : '85vh'),
      }}
    >
      {/* Control bar with toggle buttons */}
      <div className="flex justify-between items-center px-3 py-2 bg-primary/10 border-b border-gray-200 dark:border-gray-700">
        <h3 
          className="font-medium text-primary text-sm flex items-center cursor-pointer" 
          onClick={() => setDisplayMode(displayMode === 'minimized' ? 'expanded' : 'minimized')}
        >
          <span className="mr-1">{displayMode === 'minimized' ? '▶' : '▼'}</span>
          Live Salary Preview
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
            {completionPercentage}% Complete
          </span>
          
          {/* Collapse button for mobile */}
          {isMobile && (
            <button 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setDisplayMode('collapsed')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content - only visible when expanded */}
      <AnimatePresence>
        {displayMode === 'expanded' && (
          <motion.div 
            className="p-3 overflow-y-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ maxHeight: isMobile ? '30vh' : '60vh' }}
          >

        
        <div className="space-y-3">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${airline ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {airline ? airlineName : 'Select an airline'}
            </span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${position ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {position ? positionName : 'Select a position'}
            </span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${salaryLevel ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {salaryLevel ? `Level ${salaryLevel}` : 'Select a salary level'}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Base Salary:</span>
            <span>{formatCurrency(liveCalculation.baseSalary, 'TRY')}</span>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Sectors:</span>
            <span>{formatCurrency(liveCalculation.sectorFees, 'TRY')}</span>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Layovers:</span>
            <span>{formatCurrency(liveCalculation.layoverFees, 'TRY')}</span>
          </div>
          
          <div className="flex justify-between font-medium text-base mt-2">
            <span>Estimated Total:</span>
            <span className="text-primary">{formatCurrency(liveCalculation.grandTotal, 'TRY')}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div className="bg-gray-50 dark:bg-gray-700 p-1 rounded text-center">
              ≈ {formatCurrency(liveCalculation.usdEquivalent, 'USD')}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-1 rounded text-center">
              ≈ {formatCurrency(liveCalculation.eurEquivalent, 'EUR')}
            </div>
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {displayMode === 'expanded' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 text-xs text-center text-blue-800 dark:text-blue-300">
          Continue to see detailed breakdown and comparison
        </div>
      )}
    </motion.div>
  );
};

export default LivePreview;

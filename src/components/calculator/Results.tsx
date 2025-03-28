import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '../../contexts/CalculatorContext';
import SalaryBreakdown from '../results/SalaryBreakdown';
import AirlineComparison from '../results/AirlineComparison';
import ThemeToggle from '../ui/ThemeToggle';
import PDFExport from '../ui/PDFExport';
import UserSettings from '../ui/UserSettings';
import ErrorBoundary from '../ui/ErrorBoundary';
import AnimatedCounter from '../ui/AnimatedCounter';
import { formatCurrency } from '../../utils/formatters';

// Safe wrapper for chart components
interface SafeChartWrapperProps {
  children: React.ReactNode;
  name: string;
}

const SafeChartWrapper: React.FC<SafeChartWrapperProps> = ({ children, name }) => {
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (hasError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
        <p className="text-red-600 dark:text-red-400">Error rendering {name}</p>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center animate-pulse">
        <p className="text-gray-500 dark:text-gray-400">Loading {name}...</p>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`Error in ${name}:`, error);
    setHasError(true);
    return null;
  }
};

const Results = () => {
  const { previousStep, resetCalculator, results, airline, position, salaryLevel, season, salaryMultiplier, calculateResults, calculateComparison } = useCalculator();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'comparison'>('breakdown');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Add debugging and force recalculation if needed
  useEffect(() => {
    // If results are missing but we have airline data, try to recalculate
    if (!results && airline) {
      calculateResults();
      calculateComparison();
      // Force component update
      setForceUpdate(prev => prev + 1);
    }
  }, [results, airline, calculateResults, calculateComparison, forceUpdate]);
  
  // Toggle card expansion
  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };
  
  if (!results) {
    console.log('Results is null or undefined');
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-4">No calculation results available</h3>
        <p className="mb-6">Please complete the previous steps to view your results.</p>
        <button 
          onClick={resetCalculator}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Start Over
        </button>
      </div>
    );
  }
  
  const airlineName = airline === 'yellow' ? 'Yellow Tail' : 'Blue Tail';
  const positionLabel = position === 'captain' ? 'Captain' : 'First Officer';
  
  // Only render if we have results
  if (!results) {
    return (
      <div className="text-center py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold mb-4">Calculating results...</h3>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <button 
            onClick={() => {
              calculateResults();
              calculateComparison();
              setForceUpdate(prev => prev + 1);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry Calculation
          </button>
        </motion.div>
      </div>
    );
  }
  
  const { baseSalary, sectorFees, layoverFees, totalSalary, grandTotal, usdEquivalent, eurEquivalent } = results;
  
  return (
    <>
      <ErrorBoundary name="UserSettings" fallback={<div className="fixed z-50 top-4 right-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg shadow-lg">
        <p className="text-red-700 dark:text-red-300">Settings panel unavailable</p>
        <button 
          onClick={() => setSettingsOpen(false)}
          className="mt-2 px-3 py-1 bg-red-200 dark:bg-red-800 rounded text-sm"
        >
          Close
        </button>
      </div>}>
        <UserSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </ErrorBoundary>
      
      <motion.div 
        className="space-y-6 results-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        ref={resultsContainerRef}
        key={`results-container-${forceUpdate}`}
      >
        {/* Header with Date and Theme Toggle */}
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
          >
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <PDFExport containerRef={resultsContainerRef} />
            
            {/* Settings Button */}
            <motion.button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Open Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </motion.button>
            
            <ErrorBoundary name="ThemeToggle" fallback={<div className="w-10 h-10"></div>}>
              <ThemeToggle />
            </ErrorBoundary>
          </motion.div>
        </div>
        
        {/* Main Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white p-6 mobile-px-2 mobile-py-3 shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 mobile-text-sm">{airlineName} Airlines</h1>
              <div className="flex flex-wrap items-center gap-2 text-blue-100">
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-sm">{positionLabel}</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-sm">{salaryLevel}</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-sm capitalize">{season} Season</span>
                {salaryMultiplier === 'double' && (
                  <span className="px-2 py-0.5 bg-green-500/30 rounded-full text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    Double Salary
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-sm mb-1">Total Monthly Salary</div>
              <div className="text-3xl font-bold mobile-text-sm">
                <AnimatedCounter 
                  value={grandTotal}
                  formatValue={(val) => formatCurrency(val, 'TRY')}
                  duration={1.5}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Summary Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {/* Base Salary Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md summary-card"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Base Salary</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter 
                    value={baseSalary}
                    formatValue={(val) => formatCurrency(val, 'TRY')}
                    duration={1.5}
                  />
                </div>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            {salaryMultiplier === 'double' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded"
              >
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  2x multiplier applied to base salary
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Sector Fees Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md summary-card"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sector Fees</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter 
                    value={sectorFees}
                    formatValue={(val) => formatCurrency(val, 'TRY')}
                    duration={1.5}
                  />
                </div>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
            {season === 'busy' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded"
              >
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  50% sector fee increase (Busy Season)
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Layover Fees Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md summary-card"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Layover Fees</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter 
                    value={layoverFees}
                    formatValue={(val) => formatCurrency(val, 'TRY')}
                    duration={1.5}
                  />
                </div>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Currency Conversion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Currency Equivalents</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">Updated Today</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="font-bold">$</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">US Dollar</div>
                  <div className="font-medium">
                    <AnimatedCounter 
                      value={usdEquivalent}
                      formatValue={(val) => formatCurrency(val, 'USD')}
                      duration={1.5}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                USD/TRY: {(grandTotal / usdEquivalent).toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="font-bold">€</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Euro</div>
                  <div className="font-medium">
                    <AnimatedCounter 
                      value={eurEquivalent}
                      formatValue={(val) => formatCurrency(val, 'EUR')}
                      duration={1.5}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                EUR/TRY: {(grandTotal / eurEquivalent).toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 mobile-px-2 rounded-xl shadow-md mb-4 overflow-hidden"
        >
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-4 text-sm">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'breakdown' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('breakdown')}
            >
              Salary Breakdown
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'comparison' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('comparison')}
            >
              Airline Comparison
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="ml-auto px-3 py-1 text-sm flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Settings
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'breakdown' ? (
              <motion.div
                key="breakdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] flex flex-col responsive-chart"
              >
                <SafeChartWrapper name="Salary Breakdown Chart">
                  <Suspense fallback={<div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse h-[280px]">Loading salary breakdown...</div>}>
                    <SalaryBreakdown />
                  </Suspense>
                </SafeChartWrapper>
              </motion.div>
            ) : (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] flex flex-col responsive-chart"
              >
                <SafeChartWrapper name="Airline Comparison Chart">
                  <Suspense fallback={<div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse h-[280px]">Loading airline comparison...</div>}>
                    <AirlineComparison />
                  </Suspense>
                </SafeChartWrapper>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Bottom Action Bar */}
        <motion.div 
          className="mt-8 py-4 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg sticky bottom-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <motion.button
              type="button" 
              onClick={previousStep}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 flex-1 sm:flex-initial"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Modify Inputs</span>
              </div>
            </motion.button>
            
            <motion.button
              type="button" 
              onClick={resetCalculator}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 flex-1 sm:flex-initial"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Start New Calculation</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Results;

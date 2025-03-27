import React from 'react';
import { motion } from 'framer-motion';
import { useCalculator } from '../../contexts/CalculatorContext';
import { formatCurrency } from '../../utils/formatters';
import SalaryPieChart from '../charts/SalaryPieChart';
import AnimatedCounter from '../ui/AnimatedCounter';

const SalaryBreakdown = () => {
  const { results, airline, salaryMultiplier } = useCalculator();
  
  if (!results) return null;
  
  const { baseSalary, sectorFees, layoverFees, totalSalary, grandTotal, usdEquivalent, eurEquivalent } = results;
  const airlineName = airline === 'yellow' ? 'Yellow Tail' : 'Blue Tail';
  
  // Format function for currency values
  const formatCurrencyValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format function for USD currency values
  const formatUsdValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format function for EUR currency values
  const formatEurValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <motion.div 
      className="card mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-semibold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Salary Breakdown - {airlineName}
      </motion.h2>
      
      <div className="flex flex-col md:flex-row gap-8 mb-6">
        {/* Chart visualization */}
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-4"
          >
            <SalaryPieChart />
          </motion.div>
          <motion.div 
            className="text-center text-sm text-gray-500 dark:text-gray-400 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Component breakdown as percentage of total
          </motion.div>
        </div>
        
        {/* Salary breakdown details */}
        <div className="md:w-1/2 space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <span className="text-gray-600 dark:text-gray-300">Base Salary</span>
              {salaryMultiplier === 'double' && (
                <motion.span 
                  className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  2x Multiplier
                </motion.span>
              )}
            </div>
            <span className="font-medium">
              <AnimatedCounter 
                value={baseSalary} 
                formatValue={formatCurrencyValue} 
                delay={0.2}
              />
            </span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Sector Fees</span>
            <span className="font-medium">
              <AnimatedCounter 
                value={sectorFees} 
                formatValue={formatCurrencyValue} 
                delay={0.4}
              />
            </span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Layover Fees</span>
            <span className="font-medium">
              <AnimatedCounter 
                value={layoverFees} 
                formatValue={formatCurrencyValue} 
                delay={0.6}
              />
            </span>
          </div>
          
          <div className="flex justify-between py-4 mt-2 bg-blue-50 dark:bg-blue-900/20 px-4 rounded-lg">
            <span className="font-semibold">Total Salary</span>
            <span className="font-semibold text-xl text-blue-600 dark:text-blue-400">
              <AnimatedCounter 
                value={grandTotal} 
                formatValue={formatCurrencyValue} 
                delay={0.8}
                className="font-bold"
              />
            </span>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h3 className="text-lg font-medium mb-4">Equivalent Value</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div 
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">USD Equivalent</div>
            <div className="text-xl font-medium mt-1">
              <AnimatedCounter 
                value={usdEquivalent} 
                formatValue={formatUsdValue} 
                delay={1.2}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">EUR Equivalent</div>
            <div className="text-xl font-medium mt-1">
              <AnimatedCounter 
                value={eurEquivalent} 
                formatValue={formatEurValue} 
                delay={1.4}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SalaryBreakdown;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCalculator } from '../../contexts/CalculatorContext';
import { formatCurrency } from '../../utils/formatters';
import ComparisonBarChart from '../charts/ComparisonBarChart';
import AnimatedCounter from '../ui/AnimatedCounter';

const AirlineComparison = () => {
  const { results, comparisonResults, airline } = useCalculator();
  const [showTable, setShowTable] = useState<boolean>(false);
  
  if (!results || !comparisonResults) return null;
  
  const currentAirline = airline === 'yellow' ? 'Yellow Tail' : 'Blue Tail';
  const otherAirline = airline === 'yellow' ? 'Blue Tail' : 'Yellow Tail';
  
  const diff = results.grandTotal - comparisonResults.grandTotal;
  const diffPercent = (diff / comparisonResults.grandTotal) * 100;
  const isBetter = diff > 0;
  
  // Format function for currency differences
  const formatDiffValue = (value: number) => {
    return `${value >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(value)}`;  
  };
  
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold">Airline Comparison</h2>
        
        <motion.span 
          className={`
            px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
            ${isBetter ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}
          `}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, delay: 1 }}
        >
          {isBetter 
            ? `${currentAirline} pays ${formatCurrency(Math.abs(diff), 'TRY')} more` 
            : `${otherAirline} pays ${formatCurrency(Math.abs(diff), 'TRY')} more`}
          {` (${Math.abs(diffPercent).toFixed(1)}%)`}
        </motion.span>
      </motion.div>
      
      {/* Chart View */}
      <div className="mb-6">
        <ComparisonBarChart />
      </div>
      
      {/* Toggle button for detailed table */}
      <div className="flex justify-center mb-4">
        <motion.button
          onClick={() => setShowTable(!showTable)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showTable ? 'Hide Detailed Comparison' : 'Show Detailed Comparison'}
        </motion.button>
      </div>
      
      {/* Detailed comparison table */}
      <motion.div 
        className="overflow-x-auto"
        initial={showTable ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        animate={showTable ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showTable && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-medium">Component</th>
                <th className="py-3 px-4 font-medium text-right">{currentAirline}</th>
                <th className="py-3 px-4 font-medium text-right">{otherAirline}</th>
                <th className="py-3 px-4 font-medium text-right">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4">Base Salary</td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={results.baseSalary} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={0.1}
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={comparisonResults.baseSalary} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={0.2}
                  />
                </td>
                <td className={`py-3 px-4 text-right ${results.baseSalary >= comparisonResults.baseSalary ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <AnimatedCounter 
                    value={results.baseSalary - comparisonResults.baseSalary} 
                    formatValue={formatDiffValue} 
                    delay={0.3}
                  />
                </td>
              </tr>
              
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4">Sector Fees</td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={results.sectorFees} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={0.4}
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={comparisonResults.sectorFees} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={0.5}
                  />
                </td>
                <td className={`py-3 px-4 text-right ${results.sectorFees >= comparisonResults.sectorFees ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <AnimatedCounter 
                    value={results.sectorFees - comparisonResults.sectorFees} 
                    formatValue={formatDiffValue} 
                    delay={0.6}
                  />
                </td>
              </tr>
              
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4">Layover Fees</td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={results.layoverFees} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={0.7}
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={comparisonResults.layoverFees} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={0.8}
                  />
                </td>
                <td className={`py-3 px-4 text-right ${results.layoverFees >= comparisonResults.layoverFees ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <AnimatedCounter 
                    value={results.layoverFees - comparisonResults.layoverFees} 
                    formatValue={formatDiffValue} 
                    delay={0.9}
                  />
                </td>
              </tr>
              
              <tr className="font-medium">
                <td className="py-3 px-4">Grand Total</td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={results.grandTotal} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={1.0}
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <AnimatedCounter 
                    value={comparisonResults.grandTotal} 
                    formatValue={(val) => formatCurrency(val, 'TRY')} 
                    delay={1.1}
                  />
                </td>
                <td className={`py-3 px-4 text-right ${diff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <AnimatedCounter 
                    value={diff} 
                    formatValue={formatDiffValue} 
                    delay={1.2}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AirlineComparison;

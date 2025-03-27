import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { SalaryLevelType, SalaryMultiplierType } from '../../types/calculator.types';
import { motion } from 'framer-motion';

const DetailsSelector = () => {
  const { 
    position, 
    salaryLevel, 
    setSalaryLevel, 
    season, 
    setSeason,
    salaryMultiplier,
    setSalaryMultiplier,
    nextStep, 
    previousStep 
  } = useCalculator();
  
  // Define available salary levels based on position
  const salaryLevels: SalaryLevelType[] = position === 'firstOfficer' 
    ? ['F1', 'F2', 'F3', 'F4'] 
    : ['C1', 'C2', 'C3', 'C4'];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Salary Details</h2>
      
      <div className="space-y-6">
        {/* Salary Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Salary Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {salaryLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSalaryLevel(level)}
                className={`
                  py-3 px-4 rounded-lg transition-all text-center
                  ${salaryLevel === level 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        {/* Season */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Season
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSeason('normal')}
              className={`
                py-3 px-4 rounded-lg transition-all
                ${season === 'normal'
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}
              `}
            >
              Normal Season
            </button>
            <button
              type="button"
              onClick={() => setSeason('busy')}
              className={`
                py-3 px-4 rounded-lg transition-all
                ${season === 'busy'
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}
              `}
            >
              Busy Season
              <div className="text-xs mt-1 font-normal">
                (50% Sector Fee Increase)
              </div>
            </button>
          </div>
        </div>
        
        {/* Salary Multiplier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Salary Multiplier
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSalaryMultiplier('normal')}
              className={`
                py-3 px-4 rounded-lg transition-all
                ${salaryMultiplier === 'normal'
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}
              `}
            >
              Normal Salary
            </button>
            <motion.button
              type="button"
              onClick={() => setSalaryMultiplier('double')}
              className={`
                py-3 px-4 rounded-lg transition-all
                ${salaryMultiplier === 'double'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}
              `}
              whileHover={{ scale: salaryMultiplier !== 'double' ? 1.03 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              Double Base Salary
              <div className="text-xs mt-1 font-normal">
                (2x Base Salary Amount)
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          type="button" 
          onClick={previousStep}
          className="btn btn-outline"
        >
          Back
        </button>
        
        <button
          type="button" 
          onClick={nextStep}
          disabled={!salaryLevel}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DetailsSelector;

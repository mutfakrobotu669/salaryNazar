import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import { formatCurrency } from '../../utils/formatters';

const LivePreview = () => {
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
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-primary">Live Salary Preview</h3>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
            {completionPercentage}% Complete
          </span>
        </div>
        
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
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 text-xs text-center text-blue-800 dark:text-blue-300">
        Continue to see detailed breakdown and comparison
      </div>
    </div>
  );
};

export default LivePreview;

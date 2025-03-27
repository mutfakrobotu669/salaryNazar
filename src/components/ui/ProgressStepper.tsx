import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useCalculator } from '../../contexts/CalculatorContext';

const steps = [
  { id: 'airline', label: 'Airline' },
  { id: 'position', label: 'Position' },
  { id: 'details', label: 'Details' },
  { id: 'flights', label: 'Flights' },
  { id: 'results', label: 'Results' }
];

const ProgressStepper = () => {
  const { currentStep, goToStep } = useCalculator();
  
  return (
    <div className="w-full mb-8">
      <div className="relative flex justify-between">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Progress fill */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center">
            <button
              onClick={() => {
                // Only allow navigation to previous steps or the next immediate step
                if (index <= currentStep + 1) {
                  goToStep(index);
                }
              }}
              disabled={index > currentStep + 1}
              className={`
                z-10 flex items-center justify-center w-8 h-8 rounded-full 
                transition-all duration-300 focus:outline-none
                ${index < currentStep 
                  ? 'bg-primary text-white' 
                  : index === currentStep
                  ? 'border-2 border-primary bg-white dark:bg-gray-800 text-primary' 
                  : 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }
                ${index > currentStep + 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {index < currentStep 
                ? <CheckIcon className="w-5 h-5" /> 
                : index + 1
              }
            </button>
            <span className={`
              mt-2 text-xs font-medium hidden sm:block
              ${index <= currentStep ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}
            `}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;

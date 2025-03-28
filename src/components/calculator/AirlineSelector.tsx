import { useCalculator } from '../../contexts/CalculatorContext';
import { motion } from 'framer-motion';

const AirlineSelector = () => {
  const { airline, setAirline, nextStep } = useCalculator();
  
  // Handle airline selection with auto-proceed
  const handleAirlineSelect = (selectedAirline: 'yellow' | 'blue') => {
    setAirline(selectedAirline);
    // Short delay before proceeding to next step for better UX
    setTimeout(() => nextStep(), 300);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Select Your Airline</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Yellow Tail Option */}
        <button
          type="button"
          onClick={() => handleAirlineSelect('yellow')}
          className={`
            p-6 rounded-lg border-2 transition-all
            flex flex-col items-center
            ${airline === 'yellow' 
              ? 'border-primary bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-200 hover:border-blue-200 dark:border-gray-700'}
          `}
        >
          <div className="w-24 h-24 bg-yellow-tail rounded-lg mb-4 flex items-center justify-center">
            <span className="text-yellow-800 font-bold text-lg">YT</span>
          </div>
          <h3 className="text-lg font-medium">Yellow Tail</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Pegasus-like carrier with extensive domestic routes
          </p>
        </button>
        
        {/* Blue Tail Option */}
        <button
          type="button"
          onClick={() => handleAirlineSelect('blue')}
          className={`
            p-6 rounded-lg border-2 transition-all
            flex flex-col items-center
            ${airline === 'blue' 
              ? 'border-primary bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-200 hover:border-blue-200 dark:border-gray-700'}
          `}
        >
          <div className="w-24 h-24 bg-blue-tail rounded-lg mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-lg">BT</span>
          </div>
          <h3 className="text-lg font-medium">Blue Tail</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            AJet-like carrier with international focus
          </p>
        </button>
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
        Select an airline to continue
      </div>
    </div>
  );
};

export default AirlineSelector;

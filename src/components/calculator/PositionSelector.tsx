import { useCalculator } from '../../contexts/CalculatorContext';

const PositionSelector = () => {
  const { position, setPosition, nextStep, previousStep } = useCalculator();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Select Your Position</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Officer */}
        <button
          type="button"
          onClick={() => setPosition('firstOfficer')}
          className={`
            p-6 rounded-lg border-2 transition-all
            flex flex-col items-center
            ${position === 'firstOfficer' 
              ? 'border-primary bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-200 hover:border-blue-200 dark:border-gray-700'}
          `}
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-800 dark:text-gray-200 font-bold text-xl">F/O</span>
          </div>
          <h3 className="text-lg font-medium">First Officer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            First Officer positions (F1-F4)
          </p>
        </button>
        
        {/* Captain */}
        <button
          type="button"
          onClick={() => setPosition('captain')}
          className={`
            p-6 rounded-lg border-2 transition-all
            flex flex-col items-center
            ${position === 'captain' 
              ? 'border-primary bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-200 hover:border-blue-200 dark:border-gray-700'}
          `}
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-800 dark:text-gray-200 font-bold text-xl">CPT</span>
          </div>
          <h3 className="text-lg font-medium">Captain</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Captain positions (C1-C4)
          </p>
        </button>
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
          disabled={!position}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PositionSelector;

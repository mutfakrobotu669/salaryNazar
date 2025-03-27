import { useCalculator } from '../../contexts/CalculatorContext';
import { SectorCounts, LayoverCounts } from '../../types/calculator.types';

const FlightInputs = () => {
  const { 
    sectors, 
    updateSector, 
    layovers, 
    updateLayover,
    nextStep, 
    previousStep 
  } = useCalculator();
  
  // Helper function for number inputs
  const handleNumberInput = (
    value: string, 
    field: keyof SectorCounts | keyof LayoverCounts, 
    updateFn: (field: any, value: number) => void
  ) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      updateFn(field, numValue);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Flight Details</h2>
      
      <div className="space-y-6">
        {/* Sectors */}
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Sector Counts</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Regular Flights</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(['S1', 'S2', 'S3', 'S4', 'Night'] as const).map((sector) => (
                    <div key={sector} className="space-y-1">
                      <label htmlFor={`sector-${sector}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {sector}
                      </label>
                      <input
                        type="number"
                        id={`sector-${sector}`}
                        value={sectors[sector] || ''}
                        onChange={(e) => handleNumberInput(e.target.value, sector, updateSector)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Passenger Flights</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(['passS1', 'passS2', 'passS3', 'passS4', 'passNight'] as const).map((sector) => (
                    <div key={sector} className="space-y-1">
                      <label htmlFor={`sector-${sector}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {sector.replace('pass', '')}
                      </label>
                      <input
                        type="number"
                        id={`sector-${sector}`}
                        value={sectors[sector] || ''}
                        onChange={(e) => handleNumberInput(e.target.value, sector, updateSector)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              Note: Passenger flights are paid at 50% of regular flight rates
            </div>
          </div>
        </div>
        
        {/* Layovers */}
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Layovers</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['international', 'domestic', 'ercan'] as const).map((layoverType) => (
              <div key={layoverType} className="space-y-1">
                <label htmlFor={`layover-${layoverType}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {layoverType}
                </label>
                <input
                  type="number"
                  id={`layover-${layoverType}`}
                  value={layovers[layoverType] || ''}
                  onChange={(e) => handleNumberInput(e.target.value, layoverType, updateLayover)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {layoverType === 'international' ? '(€50 per night)' : '(₺500 per night)'}
                </div>
              </div>
            ))}
          </div>
        </div>
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
          className="btn btn-primary"
        >
          Calculate Results
        </button>
      </div>
    </div>
  );
};

export default FlightInputs;

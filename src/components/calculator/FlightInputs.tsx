import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '../../contexts/CalculatorContext';
import { SectorCounts, LayoverCounts } from '../../types/calculator.types';
import SectorImageUpload from './SectorImageUpload';
import { SectorData } from '../../services/openai';

const FlightInputs = () => {
  // Add a selection mode state to control which view is shown
  const [inputMode, setInputMode] = useState<'selection' | 'manual' | 'upload'>('selection');
  const [processingSuccess, setProcessingSuccess] = useState(false);
  
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
  
  // Handle data extracted from the sector screenshot
  const handleSectorDataExtracted = (data: SectorData) => {
    // Update regular flight sector counts
    updateSector('S1', data.S1);
    updateSector('S2', data.S2);
    updateSector('S3', data.S3);
    updateSector('S4', data.S4);
    updateSector('Night', data.NIGHT);
    
    // Update passenger flight sector counts
    updateSector('passS1', data.passS1);
    updateSector('passS2', data.passS2);
    updateSector('passS3', data.passS3);
    updateSector('passS4', data.passS4);
    updateSector('passNight', data.passNight);
    
    // Show success message
    setProcessingSuccess(true);
    
    // Automatically switch to manual entry mode for verification
    setInputMode('manual');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setProcessingSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Flight Details</h2>
      
      <AnimatePresence mode="wait">
        {inputMode === 'selection' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card p-8"
          >
            <h3 className="text-xl font-medium text-center mb-8">How would you like to enter flight sector data?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manual Entry Option */}
              <div 
                onClick={() => setInputMode('manual')}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary dark:hover:border-primary cursor-pointer transition-all hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium mb-2">Manual Entry</h4>
                <p className="text-center text-gray-600 dark:text-gray-400">Manually enter your sector and layover counts</p>
              </div>

              {/* Upload Screenshot Option */}
              <div 
                onClick={() => setInputMode('upload')}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary dark:hover:border-primary cursor-pointer transition-all hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium mb-2">Upload Screenshot</h4>
                <p className="text-center text-gray-600 dark:text-gray-400">Upload an image of your flight sector page</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="input-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Main Content Card */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Sector Counts</h3>
                
                {inputMode === 'manual' && (
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Upload Screenshot
                  </button>
                )}
                
                {inputMode === 'upload' && (
                  <button
                    type="button"
                    onClick={() => setInputMode('manual')}
                    className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Manual Entry
                  </button>
                )}
              </div>
          
              <AnimatePresence mode="wait">
                {processingSuccess && (
                  <motion.div 
                    className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-3 mb-4 rounded-lg flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sector data successfully extracted! Please verify the numbers below.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {inputMode === 'upload' ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-4"
                  >
                    <SectorImageUpload onSectorDataExtracted={handleSectorDataExtracted} />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Upload a screenshot of your flight sector page to automatically fill in the sector counts.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="manual"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
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
                </motion.div>
              )}
            </AnimatePresence>
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
          </motion.div>
        )}
      </AnimatePresence>
        

      
      <div className="flex justify-between mt-8">
        <button
          type="button" 
          onClick={inputMode === 'selection' ? previousStep : () => setInputMode('selection')}
          className="btn btn-outline"
        >
          {inputMode === 'selection' ? 'Back' : 'Change Entry Method'}
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

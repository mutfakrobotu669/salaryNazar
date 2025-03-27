import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '../../contexts/CalculatorContext';
import ProgressStepper from '../ui/ProgressStepper';
import AirlineSelector from './AirlineSelector';
import PositionSelector from './PositionSelector';
import DetailsSelector from './DetailsSelector';
import FlightInputs from './FlightInputs';
import Results from './Results';

const CalculatorView = () => {
  const { currentStep } = useCalculator();
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100,
      scale: 0.95
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: -100,
      scale: 0.95
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };
  
  // Function to render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AirlineSelector />;
      case 1:
        return <PositionSelector />;
      case 2:
        return <DetailsSelector />;
      case 3:
        return <FlightInputs />;
      case 4:
        return <Results />;
      default:
        return <AirlineSelector />;
    }
  };
  
  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        PilotPro Salary Calculator
      </motion.h1>
      
      <ProgressStepper />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8 overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalculatorView;

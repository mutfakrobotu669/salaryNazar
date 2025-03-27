import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  AirlineType, 
  PositionType, 
  SalaryLevelType, 
  SeasonType,
  SalaryMultiplierType,
  SectorCounts,
  LayoverCounts,
  CalculationResult 
} from '../types/calculator.types';
import { calculateSalary } from '../utils/calculators';

// Default values for sectors and layovers
const defaultSectors: SectorCounts = {
  S1: 0, S2: 0, S3: 0, S4: 0, Night: 0,
  passS1: 0, passS2: 0, passS3: 0, passS4: 0, passNight: 0
};

const defaultLayovers: LayoverCounts = {
  international: 0,
  domestic: 0,
  ercan: 0
};

// Exchange rates - in a production app, these would be fetched from an API
const exchangeRates = {
  USD: 0.033, // 1 TRY = 0.033 USD (example rate)
  EUR: 0.031  // 1 TRY = 0.031 EUR (example rate)
};

interface CalculatorContextType {
  currentStep: number;
  airline: AirlineType | null;
  position: PositionType | null;
  salaryLevel: SalaryLevelType | null;
  season: SeasonType;
  salaryMultiplier: SalaryMultiplierType;
  sectors: SectorCounts;
  layovers: LayoverCounts;
  results: CalculationResult | null;
  comparisonResults: CalculationResult | null;
  liveCalculation: CalculationResult | null;
  completionPercentage: number;
  
  setAirline: (airline: AirlineType) => void;
  setPosition: (position: PositionType) => void;
  setSalaryLevel: (level: SalaryLevelType) => void;
  setSeason: (season: SeasonType) => void;
  setSalaryMultiplier: (multiplier: SalaryMultiplierType) => void;
  updateSector: (type: keyof SectorCounts, value: number) => void;
  updateLayover: (type: keyof LayoverCounts, value: number) => void;
  calculateResults: () => void;
  calculateComparison: () => void;
  nextStep: () => void;
  previousStep: () => void;
  resetCalculator: () => void;
  goToStep: (step: number) => void;
}

export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [airline, setAirline] = useState<AirlineType | null>(null);
  const [position, setPosition] = useState<PositionType | null>(null);
  const [salaryLevel, setSalaryLevel] = useState<SalaryLevelType | null>(null);
  const [season, setSeason] = useState<SeasonType>('normal');
  const [salaryMultiplier, setSalaryMultiplier] = useState<SalaryMultiplierType>('normal');
  const [sectors, setSectors] = useState<SectorCounts>(defaultSectors);
  const [layovers, setLayovers] = useState<LayoverCounts>(defaultLayovers);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<CalculationResult | null>(null);
  const [liveCalculation, setLiveCalculation] = useState<CalculationResult | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    let filledFields = 0;
    let totalFields = 0;
    
    // Step 0: Airline (1 field)
    if (airline) filledFields++;
    totalFields++;
    
    // Step 1: Position (1 field)
    if (currentStep >= 1) {
      totalFields++;
      if (position) filledFields++;
    }
    
    // Step 2: Salary details (2 fields)
    if (currentStep >= 2) {
      totalFields += 2;
      if (salaryLevel) filledFields++;
      filledFields++; // Season always has a default value
    }
    
    // Step 3: Flight details (many fields, but we'll count this as 2 main areas)
    if (currentStep >= 3) {
      totalFields += 2;
      
      // Check if any sector counts are filled
      const hasSectors = Object.values(sectors).some(val => val > 0);
      if (hasSectors) filledFields++;
      
      // Check if any layover counts are filled
      const hasLayovers = Object.values(layovers).some(val => val > 0);
      if (hasLayovers) filledFields++;
    }
    
    return Math.round((filledFields / totalFields) * 100);
  };

  // Perform live calculations whenever relevant inputs change
  useEffect(() => {
    if (airline && position && salaryLevel) {
      const result = calculateSalary(
        airline,
        position,
        salaryLevel,
        season,
        sectors,
        layovers,
        exchangeRates,
        salaryMultiplier
      );
      
      setLiveCalculation(result);
    }
    
    // Update completion percentage
    setCompletionPercentage(calculateCompletionPercentage());
  }, [airline, position, salaryLevel, season, sectors, layovers, salaryMultiplier]);

  // Handlers
  const updateSector = (type: keyof SectorCounts, value: number) => {
    setSectors(prev => ({ ...prev, [type]: Math.max(0, value) }));
  };

  const updateLayover = (type: keyof LayoverCounts, value: number) => {
    setLayovers(prev => ({ ...prev, [type]: Math.max(0, value) }));
  };

  const calculateResults = () => {
    console.log('calculateResults called with:', { airline, position, salaryLevel, season, sectors, layovers, salaryMultiplier });
    
    if (!airline || !position || !salaryLevel) {
      console.error('Missing required data for calculation:', { airline, position, salaryLevel });
      return;
    }

    try {
      const result = calculateSalary(
        airline,
        position,
        salaryLevel,
        season,
        sectors,
        layovers,
        exchangeRates,
        salaryMultiplier
      );

      console.log('Calculation result:', result);
      setResults(result);
    } catch (error) {
      console.error('Error in calculation:', error);
    }
  };

  const calculateComparison = () => {
    if (!airline || !position || !salaryLevel) return;

    // Calculate for the other airline
    const otherAirline: AirlineType = airline === 'yellow' ? 'blue' : 'yellow';
    
    const result = calculateSalary(
      otherAirline,
      position,
      salaryLevel,
      season,
      sectors,
      layovers,
      exchangeRates,
      salaryMultiplier
    );

    setComparisonResults(result);
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      // If we're moving to results, calculate them
      if (prev === 3) {
        console.log('Moving to results step, calculating...');
        calculateResults();
        calculateComparison();
        
        // Force a delay to ensure state updates before rendering
        setTimeout(() => {
          console.log('Delayed check - results:', results);
        }, 100);
      }
      return Math.min(prev + 1, 4);
    });
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= 4) {
      setCurrentStep(step);
    }
  };

  const resetCalculator = () => {
    setCurrentStep(0);
    setAirline(null);
    setPosition(null);
    setSalaryLevel(null);
    setSeason('normal');
    setSectors(defaultSectors);
    setLayovers(defaultLayovers);
    setResults(null);
    setComparisonResults(null);
  };

  return (
    <CalculatorContext.Provider value={{
      currentStep,
      airline,
      position,
      salaryLevel,
      season,
      salaryMultiplier,
      sectors,
      layovers,
      results,
      comparisonResults,
      liveCalculation,
      completionPercentage,
      setAirline,
      setPosition,
      setSalaryLevel,
      setSeason,
      setSalaryMultiplier,
      updateSector,
      updateLayover,
      calculateResults,
      calculateComparison,
      nextStep,
      previousStep,
      resetCalculator,
      goToStep
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};

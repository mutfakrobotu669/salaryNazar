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
import { yellowTailData, blueTailData } from '../data/salaryData';

export const calculateSalary = (
  airline: AirlineType,
  position: PositionType,
  salaryLevel: SalaryLevelType,
  season: SeasonType,
  sectors: SectorCounts,
  layovers: LayoverCounts,
  exchangeRates: { USD: number; EUR: number },
  salaryMultiplier: SalaryMultiplierType = 'normal'
): CalculationResult => {
  // Select the appropriate data set based on airline
  const data = airline === 'yellow' ? yellowTailData : blueTailData;
  
  // Calculate base salary with multiplier
  let baseSalary = data.BASE_SALARIES[salaryLevel];
  
  // Apply double salary if selected
  if (salaryMultiplier === 'double') {
    baseSalary = baseSalary * 2;
  }
  
  // Calculate sector fees
  let totalSectorFees = 0;
  const sectorTypes = ['S1', 'S2', 'S3', 'S4', 'Night'] as const;
  const sectorBreakdown: { [key: string]: number } = {};
  
  // Regular sectors
  sectorTypes.forEach(type => {
    let fee = data.SECTOR_FEES[position][type];
    if (season === 'busy') {
      fee *= 1.5; // 50% increase during busy season
    }
    const sectorFee = sectors[type] * fee;
    totalSectorFees += sectorFee;
    sectorBreakdown[type] = sectorFee;
  });
  
  // Pass flight sectors (50% of regular fee)
  sectorTypes.forEach(type => {
    const passType = `pass${type}` as keyof SectorCounts;
    let fee = data.SECTOR_FEES[position][type] * 0.5;
    if (season === 'busy') {
      fee *= 1.5; // 50% increase during busy season
    }
    const passSectorFee = sectors[passType] * fee;
    totalSectorFees += passSectorFee;
    sectorBreakdown[passType] = passSectorFee;
  });
  
  // Calculate layover fees
  const layoverBreakdown: { [key: string]: number } = {};
  
  // International layovers (in EUR, need to convert to TRY)
  const intFee = layovers.international * data.LAYOVER_RATES.international * (1 / exchangeRates.EUR);
  layoverBreakdown.international = intFee;
  
  // Domestic layovers
  const domFee = layovers.domestic * data.LAYOVER_RATES.domestic;
  layoverBreakdown.domestic = domFee;
  
  // Ercan layovers
  const ercanFee = layovers.ercan * data.LAYOVER_RATES.ercan;
  layoverBreakdown.ercan = ercanFee;
  
  const totalLayoverFees = Math.round(intFee + domFee + ercanFee);
  
  // Calculate totals
  const totalSalary = baseSalary + totalSectorFees;
  const grandTotal = totalSalary + totalLayoverFees;
  
  return {
    baseSalary,
    sectorFees: totalSectorFees,
    layoverFees: totalLayoverFees,
    totalSalary,
    grandTotal,
    usdEquivalent: grandTotal * exchangeRates.USD,
    eurEquivalent: grandTotal * exchangeRates.EUR,
    exchangeRates,
    breakdown: {
      sectors: sectorBreakdown,
      layovers: layoverBreakdown
    }
  };
};

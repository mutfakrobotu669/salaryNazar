export type AirlineType = 'yellow' | 'blue';
export type PositionType = 'firstOfficer' | 'captain';
export type SalaryLevelType = 'F1' | 'F2' | 'F3' | 'F4' | 'C1' | 'C2' | 'C3' | 'C4';
export type SeasonType = 'normal' | 'busy';
export type SalaryMultiplierType = 'normal' | 'double';

export interface SectorCounts {
  S1: number;
  S2: number;
  S3: number;
  S4: number;
  Night: number;
  passS1: number;
  passS2: number;
  passS3: number;
  passS4: number;
  passNight: number;
}

export interface LayoverCounts {
  international: number;
  domestic: number;
  ercan: number;
}

export interface CalculationResult {
  baseSalary: number;
  sectorFees: number;
  layoverFees: number;
  totalSalary: number;
  grandTotal: number;
  usdEquivalent: number;
  eurEquivalent: number;
  exchangeRates: {
    USD: number;
    EUR: number;
  };
  breakdown: {
    sectors: {
      [key: string]: number;
    };
    layovers: {
      [key: string]: number;
    };
  };
}

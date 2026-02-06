import { CostBreakdown } from './product';
import { PlatformId, PlatformUserConfig } from './platform';
import { MarginCalculationResult, BreakevenResult, FixedCostItem, DiscountSimulationResult } from './calculation';

// ReverseCalculationMode (이전에 reverseCalculator.ts에서 export하던 타입)
export type ReverseCalculationMode = 'amount' | 'percent';

// -- Margin API --
export interface MarginCalculateRequest {
  sellingPrice: number;
  costs: CostBreakdown;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
}

export interface MarginCalculateResponse {
  results: MarginCalculationResult[];
}

// -- Reverse Calculation API --
export interface ReverseCalculateRequest {
  mode: ReverseCalculationMode;
  targetValue: number;
  costs: CostBreakdown;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
}

export interface ReverseCalculateResponse {
  requiredPrices: Record<string, number>;
}

// -- Simulation API (배치) --
export interface SimulationBatchRequest {
  sellingPrice: number;
  costs: CostBreakdown;
  discountPercent: number;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  curveConfig?: {
    platformId: PlatformId;
    maxDiscount?: number;
    step?: number;
  };
}

export interface SimulationBatchResponse {
  simulationResults: Array<{
    platformId: string;
    result: DiscountSimulationResult;
  }>;
  curveData?: Array<{ discount: number; netProfit: number; marginPercent: number }>;
}

// -- Breakeven API --
export interface BreakevenCalculateRequest {
  marginResult: MarginCalculationResult;
  fixedCosts: FixedCostItem[];
}

export interface BreakevenCalculateResponse {
  result: BreakevenResult;
}

// -- Generic Error --
export interface ApiErrorResponse {
  error: string;
  details?: string;
}

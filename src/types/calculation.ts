import { PlatformId, PlatformFeeBreakdown } from './platform';

export interface MarginCalculationResult {
  platformId: PlatformId;
  platformName: string;
  sellingPrice: number;
  totalCost: number;
  platformFees: PlatformFeeBreakdown;
  netProfit: number;
  marginPercent: number; // 판매가 대비 마진율
  costBasedMarginPercent: number; // 원가 대비 마진율
  isProfit: boolean;
}

export interface BreakevenResult {
  unitsToBreakeven: number;
  revenueToBreakeven: number;
  monthlyFixedCosts: number;
  profitPerUnit: number;
}

export interface FixedCostItem {
  id: string;
  label: string;
  amount: number;
}

export interface DiscountSimulationResult {
  originalMargin: MarginCalculationResult;
  discountedMargin: MarginCalculationResult;
  marginDifference: number;
  discountAmount: number;
  effectiveDiscount: number;
}

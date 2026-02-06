import { FixedCostItem, BreakevenResult } from '@/types/calculation';
import { MarginCalculationResult } from '@/types/calculation';

export function calculateBreakeven(
  marginResult: MarginCalculationResult,
  fixedCosts: FixedCostItem[]
): BreakevenResult {
  const monthlyFixedCosts = fixedCosts.reduce((sum, c) => sum + c.amount, 0);
  const profitPerUnit = marginResult.netProfit;

  const unitsToBreakeven =
    profitPerUnit > 0 ? Math.ceil(monthlyFixedCosts / profitPerUnit) : 0;

  const revenueToBreakeven = unitsToBreakeven * marginResult.sellingPrice;

  return {
    unitsToBreakeven,
    revenueToBreakeven,
    monthlyFixedCosts,
    profitPerUnit,
  };
}

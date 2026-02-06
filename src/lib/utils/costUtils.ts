import { CostBreakdown } from '@/types/product';

export function getTotalCost(costs: CostBreakdown): number {
  const otherTotal = costs.otherCosts.reduce((sum, c) => sum + c.amount, 0);
  return costs.manufacturingCost + costs.packagingCost + costs.shippingCost + otherTotal;
}

import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig } from '@/types/platform';
import { DiscountSimulationResult } from '@/types/calculation';
import { calculateMargin } from './marginCalculator';

export function simulateDiscount(
  platformId: PlatformId,
  sellingPrice: number,
  costs: CostBreakdown,
  discountPercent: number,
  userConfig?: Partial<PlatformUserConfig>
): DiscountSimulationResult {
  const discountAmount = Math.round(sellingPrice * (discountPercent / 100));
  const discountedPrice = sellingPrice - discountAmount;

  const originalMargin = calculateMargin(platformId, sellingPrice, costs, userConfig);
  const discountedMargin = calculateMargin(platformId, discountedPrice, costs, userConfig);

  return {
    originalMargin,
    discountedMargin,
    marginDifference: discountedMargin.netProfit - originalMargin.netProfit,
    discountAmount,
    effectiveDiscount: sellingPrice > 0 ? (discountAmount / sellingPrice) * 100 : 0,
  };
}

export function simulateDiscountAmount(
  platformId: PlatformId,
  sellingPrice: number,
  costs: CostBreakdown,
  couponAmount: number,
  userConfig?: Partial<PlatformUserConfig>
): DiscountSimulationResult {
  const discountedPrice = Math.max(0, sellingPrice - couponAmount);

  const originalMargin = calculateMargin(platformId, sellingPrice, costs, userConfig);
  const discountedMargin = calculateMargin(platformId, discountedPrice, costs, userConfig);

  return {
    originalMargin,
    discountedMargin,
    marginDifference: discountedMargin.netProfit - originalMargin.netProfit,
    discountAmount: couponAmount,
    effectiveDiscount: sellingPrice > 0 ? (couponAmount / sellingPrice) * 100 : 0,
  };
}

export function generateDiscountCurve(
  platformId: PlatformId,
  sellingPrice: number,
  costs: CostBreakdown,
  userConfig?: Partial<PlatformUserConfig>,
  maxDiscount = 50,
  step = 5
): { discount: number; netProfit: number; marginPercent: number }[] {
  const points = [];
  for (let d = 0; d <= maxDiscount; d += step) {
    const result = simulateDiscount(platformId, sellingPrice, costs, d, userConfig);
    points.push({
      discount: d,
      netProfit: result.discountedMargin.netProfit,
      marginPercent: result.discountedMargin.marginPercent,
    });
  }
  return points;
}

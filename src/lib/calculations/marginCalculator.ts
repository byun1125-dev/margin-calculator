import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig } from '@/types/platform';
import { MarginCalculationResult } from '@/types/calculation';
import { PLATFORM_MAP } from '@/constants/platforms';
import { calculatePlatformFees } from '@/lib/platforms';

export function getTotalCost(costs: CostBreakdown): number {
  const otherTotal = costs.otherCosts.reduce((sum, c) => sum + c.amount, 0);
  return costs.manufacturingCost + costs.packagingCost + costs.shippingCost + otherTotal;
}

export function calculateMargin(
  platformId: PlatformId,
  sellingPrice: number,
  costs: CostBreakdown,
  userConfig?: Partial<PlatformUserConfig>
): MarginCalculationResult {
  const platform = PLATFORM_MAP[platformId];
  const totalCost = getTotalCost(costs);
  
  // 할인 적용
  let finalPrice = sellingPrice;
  const discount = userConfig?.discount;
  if (discount?.enabled) {
    // 퍼센트 할인 적용
    if (discount.percentOff > 0) {
      finalPrice = finalPrice * (1 - discount.percentOff / 100);
    }
    // 금액 할인 적용
    if (discount.amountOff > 0) {
      finalPrice = finalPrice - discount.amountOff;
    }
    finalPrice = Math.max(0, finalPrice); // 음수 방지
  }

  const platformFees = calculatePlatformFees(platformId, finalPrice, userConfig);

  const netProfit = finalPrice - totalCost - platformFees.totalFees;
  const marginPercent = finalPrice > 0 ? (netProfit / finalPrice) * 100 : 0;
  const costBasedMarginPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    platformId,
    platformName: platform?.name ?? platformId,
    sellingPrice: Math.round(finalPrice), // 할인된 가격
    totalCost,
    platformFees,
    netProfit: Math.round(netProfit),
    marginPercent,
    costBasedMarginPercent,
    isProfit: netProfit > 0,
  };
}

export function calculateAllPlatforms(
  sellingPrice: number,
  costs: CostBreakdown,
  activePlatforms: PlatformId[],
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>
): MarginCalculationResult[] {
  return activePlatforms.map((platformId) =>
    calculateMargin(platformId, sellingPrice, costs, platformConfigs[platformId])
  );
}

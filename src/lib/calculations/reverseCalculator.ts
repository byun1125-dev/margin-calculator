import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig } from '@/types/platform';
import { PLATFORM_MAP } from '@/constants/platforms';
import { getTotalCost } from './marginCalculator';

export type ReverseCalculationMode = 'amount' | 'percent';

export function calculateRequiredPriceByAmount(
  platformId: PlatformId,
  targetProfit: number, // 목표 순이익 (금액)
  costs: CostBreakdown,
  userConfig?: Partial<PlatformUserConfig>
): number {
  const platform = PLATFORM_MAP[platformId];
  if (!platform) return 0;

  const totalCost = getTotalCost(costs);
  const salesRate = userConfig?.salesCommissionRate ?? platform.salesCommission.default;
  const paymentRate = userConfig?.paymentFeeRate ?? platform.paymentFee.default;
  const totalFeeRate = salesRate + paymentRate;

  // 목표 순이익(금액)으로 역산
  // 판매가 - 원가 - (판매가 * 수수료율) = 목표 순이익
  // 판매가 * (1 - 수수료율) = 원가 + 목표 순이익
  // 판매가 = (원가 + 목표 순이익) / (1 - 수수료율)
  
  const denominator = 1 - totalFeeRate;

  if (denominator <= 0) return 0;
  if (targetProfit < 0) return 0;

  return Math.ceil((totalCost + targetProfit) / denominator);
}

export function calculateRequiredPriceByPercent(
  platformId: PlatformId,
  targetMarginPercent: number, // 목표 마진율 (판매가 대비 %)
  costs: CostBreakdown,
  userConfig?: Partial<PlatformUserConfig>
): number {
  const platform = PLATFORM_MAP[platformId];
  if (!platform) return 0;

  const totalCost = getTotalCost(costs);
  const salesRate = userConfig?.salesCommissionRate ?? platform.salesCommission.default;
  const paymentRate = userConfig?.paymentFeeRate ?? platform.paymentFee.default;
  const totalFeeRate = salesRate + paymentRate;

  // 판매가 대비 마진율(%)로 역산
  // 순이익 = 판매가 * (목표마진율 / 100)
  // 판매가 - 원가 - (판매가 * 수수료율) = 판매가 * (목표마진율 / 100)
  // 판매가 * (1 - 수수료율 - 목표마진율/100) = 원가
  // 판매가 = 원가 / (1 - 수수료율 - 목표마진율/100)
  
  const marginRate = targetMarginPercent / 100;
  const denominator = 1 - totalFeeRate - marginRate;

  if (denominator <= 0) return 0;
  if (targetMarginPercent < 0) return 0;

  return Math.ceil(totalCost / denominator);
}

export function calculateRequiredPriceAllPlatforms(
  mode: ReverseCalculationMode,
  targetValue: number, // 금액 또는 퍼센트
  costs: CostBreakdown,
  activePlatforms: PlatformId[],
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>
): Record<PlatformId, number> {
  const result = {} as Record<PlatformId, number>;
  const calculateFn = mode === 'amount' 
    ? calculateRequiredPriceByAmount 
    : calculateRequiredPriceByPercent;

  for (const platformId of activePlatforms) {
    result[platformId] = calculateFn(
      platformId,
      targetValue,
      costs,
      platformConfigs[platformId]
    );
  }
  return result;
}

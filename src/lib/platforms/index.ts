import { PlatformId, PlatformFeeBreakdown, PlatformUserConfig } from '@/types/platform';
import { PLATFORM_MAP } from '@/constants/platforms';

export function calculatePlatformFees(
  platformId: PlatformId,
  sellingPrice: number,
  userConfig?: Partial<PlatformUserConfig>
): PlatformFeeBreakdown {
  const platform = PLATFORM_MAP[platformId];
  if (!platform) {
    return { salesCommission: 0, paymentFee: 0, totalFees: 0, effectiveFeeRate: 0 };
  }

  const salesRate = userConfig?.salesCommissionRate ?? platform.salesCommission.default;
  const paymentRate = userConfig?.paymentFeeRate ?? platform.paymentFee.default;

  const salesCommission = Math.round(sellingPrice * salesRate);
  const paymentFee = Math.round(sellingPrice * paymentRate);
  const totalFees = salesCommission + paymentFee;
  const effectiveFeeRate = sellingPrice > 0 ? totalFees / sellingPrice : 0;

  return {
    salesCommission,
    paymentFee,
    totalFees,
    effectiveFeeRate,
  };
}

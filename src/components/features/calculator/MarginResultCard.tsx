'use client';

import { MarginCalculationResult } from '@/types/calculation';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useCustomPlatformStore } from '@/stores/useCustomPlatformStore';
import { getPlatformMap } from '@/lib/utils/platformUtils';

interface MarginResultCardProps {
  result: MarginCalculationResult;
  originalPrice: number; // 할인 전 원래 가격
}

export function MarginResultCard({ result, originalPrice }: MarginResultCardProps) {
  const { platformConfigs, setPlatformConfig } = useCalculatorStore();
  const { customPlatforms } = useCustomPlatformStore();
  const platformMap = getPlatformMap(customPlatforms);
  const platform = platformMap[result.platformId];
  
  const discount = platformConfigs[result.platformId]?.discount;
  const hasDiscount = discount?.enabled;
  
  const toggleDiscount = () => {
    const currentDiscount = platformConfigs[result.platformId]?.discount;
    setPlatformConfig(result.platformId, {
      discount: {
        enabled: !currentDiscount?.enabled,
        percentOff: currentDiscount?.percentOff ?? 10,
        amountOff: 0,
      },
    });
  };
  
  const updateDiscountPercent = (value: number) => {
    setPlatformConfig(result.platformId, {
      discount: {
        enabled: true,
        percentOff: value,
        amountOff: 0,
      },
    });
  };

  return (
    <div className="bg-white  border-2 border-gray-200 p-4  hover: transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 "
            style={{ backgroundColor: platform?.color ?? '#888' }}
          />
          <span className="font-semibold text-gray-900 text-sm">{result.platformName}</span>
        </div>
        <Badge variant={result.isProfit ? 'profit' : 'loss'}>
          {result.isProfit ? '흑자' : '적자'}
        </Badge>
      </div>

      {/* 할인 설정 */}
      <div className="mb-3 px-3 py-2  bg-gray-50">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasDiscount}
            onChange={toggleDiscount}
            className="w-4 h-4 text-gray-900 rounded"
          />
          <span className="text-sm font-medium text-gray-700">할인</span>
          {hasDiscount && (
            <>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={discount?.percentOff ?? 0}
                onChange={(e) => updateDiscountPercent(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm text-right rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
              <span className="text-sm text-gray-600">%</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {hasDiscount && (
          <>
            <div className="flex justify-between text-xs text-gray-400">
              <span>정가</span>
              <span className="line-through">{formatNumber(originalPrice)}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">할인가</span>
              <span className="text-gray-900 font-semibold">{formatNumber(result.sellingPrice)}원</span>
            </div>
          </>
        )}
        {!hasDiscount && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">판매가</span>
            <span className="text-gray-900">{formatNumber(result.sellingPrice)}원</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">총 원가</span>
          <span className="text-gray-900">-{formatNumber(result.totalCost)}원</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">수수료</span>
          <span className="text-gray-900">
            -{formatNumber(result.platformFees.totalFees)}원
          </span>
        </div>

        <div className="border-t border-gray-100 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">순이익</span>
            <span
              className={`text-lg font-bold ${
                result.isProfit ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {formatNumber(result.netProfit)}원
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium text-gray-700">마진율</span>
            <span
              className={`text-sm font-semibold ${
                result.isProfit ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {result.marginPercent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

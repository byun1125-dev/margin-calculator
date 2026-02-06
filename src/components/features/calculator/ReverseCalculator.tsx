'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { calculateRequiredPriceAllPlatforms } from '@/lib/calculations/reverseCalculator';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { PLATFORM_MAP } from '@/constants/platforms';

export function ReverseCalculator() {
  const [targetMargin, setTargetMargin] = useState(30);
  const { costs, activePlatforms, platformConfigs } = useCalculatorStore();

  const requiredPrices = calculateRequiredPriceAllPlatforms(
    targetMargin,
    costs,
    activePlatforms,
    platformConfigs
  );

  return (
    <Card title="역마진 계산" description="목표 마진율을 입력하면 필요 판매가를 계산해요">
      <div className="mb-4">
        <Input
          label="목표 마진율"
          type="number"
          suffix="%"
          value={targetMargin}
          onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
          min={0}
          max={99}
        />
      </div>

      <div className="space-y-2">
        {activePlatforms.map((platformId) => {
          const platform = PLATFORM_MAP[platformId];
          const price = requiredPrices[platformId];
          return (
            <div
              key={platformId}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: platform?.color ?? '#888' }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {platform?.name ?? platformId}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {price > 0 ? `${formatNumber(price)}원` : '계산 불가'}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

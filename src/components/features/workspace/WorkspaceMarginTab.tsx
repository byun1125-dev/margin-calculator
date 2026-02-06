'use client';

import { useState, useEffect } from 'react';
import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig, PlatformConfig } from '@/types/platform';
import { MarginCalculationResult } from '@/types/calculation';
import { calculateAllPlatformsApi } from '@/lib/api/calculations';
import { useDebounce } from '@/hooks/useDebounce';
import { MarginResultCard } from '@/components/features/calculator/MarginResultCard';

interface WorkspaceMarginTabProps {
  costs: CostBreakdown;
  sellingPrice: number;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  customPlatforms: PlatformConfig[];
}

export function WorkspaceMarginTab({
  costs,
  sellingPrice,
  activePlatforms,
  platformConfigs,
  customPlatforms,
}: WorkspaceMarginTabProps) {
  const [results, setResults] = useState<MarginCalculationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedPrice = useDebounce(sellingPrice, 300);
  const debouncedCosts = useDebounce(costs, 300);

  useEffect(() => {
    if (debouncedPrice === 0) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    calculateAllPlatformsApi(debouncedPrice, debouncedCosts, activePlatforms, platformConfigs)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedPrice, debouncedCosts, activePlatforms, platformConfigs]);

  if (sellingPrice === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">
          판매가를 입력하면 플랫폼별 마진 계산 결과가 표시됩니다
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">계산 중...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">
          좌측에서 플랫폼을 선택해주세요
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">플랫폼별 마진 결과</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((result) => (
          <MarginResultCard
            key={result.platformId}
            result={result}
            originalPrice={sellingPrice}
          />
        ))}
      </div>
    </div>
  );
}

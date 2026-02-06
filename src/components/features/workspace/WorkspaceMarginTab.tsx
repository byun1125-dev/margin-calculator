'use client';

import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig, PlatformConfig } from '@/types/platform';
import { calculateAllPlatforms } from '@/lib/calculations/marginCalculator';
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
  if (sellingPrice === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">
          판매가를 입력하면 플랫폼별 마진 계산 결과가 표시됩니다
        </p>
      </div>
    );
  }

  const results = calculateAllPlatforms(sellingPrice, costs, activePlatforms, platformConfigs);

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

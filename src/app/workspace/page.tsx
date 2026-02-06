'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useCustomPlatformStore } from '@/stores/useCustomPlatformStore';
import { useHydration } from '@/hooks/useHydration';
import { CostInputForm } from '@/components/features/calculator/CostInputForm';
import { PlatformSelector } from '@/components/features/calculator/PlatformSelector';
import { WorkspaceResults } from '@/components/features/workspace/WorkspaceResults';
import { Calculator } from 'lucide-react';

export default function WorkspacePage() {
  const hydrated = useHydration();
  const { costs, sellingPrice, activePlatforms, platformConfigs } = useCalculatorStore();
  const { customPlatforms } = useCustomPlatformStore();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calculator size={28} />
          워크스페이스
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          플랫폼별 할인 설정, 마진 비교, 가격 역산까지 한곳에서
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 좌측: 입력 폼 */}
        <div className="lg:col-span-4 space-y-4">
          <CostInputForm />
          <PlatformSelector />
        </div>

        {/* 우측: 결과 탭 */}
        <div className="lg:col-span-8">
          <WorkspaceResults
            costs={costs}
            sellingPrice={sellingPrice}
            activePlatforms={activePlatforms}
            platformConfigs={platformConfigs}
            customPlatforms={customPlatforms}
          />
        </div>
      </div>
    </div>
  );
}

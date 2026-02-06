'use client';

import { useState } from 'react';
import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig, PlatformConfig } from '@/types/platform';
import { WorkspaceMarginTab } from './WorkspaceMarginTab';
import { WorkspaceComparisonTab } from './WorkspaceComparisonTab';
import { WorkspaceReverseTab } from './WorkspaceReverseTab';
import { Calculator, BarChart3, TrendingUp } from 'lucide-react';

type TabId = 'margin' | 'comparison' | 'reverse';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const tabs: Tab[] = [
  { id: 'margin', label: '마진 계산', icon: Calculator },
  { id: 'comparison', label: '플랫폼 비교', icon: BarChart3 },
  { id: 'reverse', label: '가격 역산', icon: TrendingUp },
];

interface WorkspaceResultsProps {
  costs: CostBreakdown;
  sellingPrice: number;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  customPlatforms: PlatformConfig[];
}

export function WorkspaceResults({
  costs,
  sellingPrice,
  activePlatforms,
  platformConfigs,
  customPlatforms,
}: WorkspaceResultsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('margin');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 탭 헤더 */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="p-6">
        {activeTab === 'margin' && (
          <WorkspaceMarginTab
            costs={costs}
            sellingPrice={sellingPrice}
            activePlatforms={activePlatforms}
            platformConfigs={platformConfigs}
            customPlatforms={customPlatforms}
          />
        )}
        {activeTab === 'comparison' && (
          <WorkspaceComparisonTab
            costs={costs}
            sellingPrice={sellingPrice}
            activePlatforms={activePlatforms}
            platformConfigs={platformConfigs}
            customPlatforms={customPlatforms}
          />
        )}
        {activeTab === 'reverse' && (
          <WorkspaceReverseTab
            costs={costs}
            activePlatforms={activePlatforms}
            platformConfigs={platformConfigs}
            customPlatforms={customPlatforms}
          />
        )}
      </div>
    </div>
  );
}

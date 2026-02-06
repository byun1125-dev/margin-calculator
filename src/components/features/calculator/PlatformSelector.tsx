'use client';

import Link from 'next/link';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useCustomPlatformStore } from '@/stores/useCustomPlatformStore';
import { getAllPlatforms } from '@/lib/utils/platformUtils';
import { Card } from '@/components/ui/Card';
import { Settings } from 'lucide-react';

export function PlatformSelector() {
  const { activePlatforms, togglePlatform } = useCalculatorStore();
  const { customPlatforms } = useCustomPlatformStore();
  const allPlatforms = getAllPlatforms(customPlatforms);

  return (
    <Card title="판매 플랫폼" description="마진을 계산할 플랫폼을 선택하세요">
      <div className="flex flex-wrap gap-2">
        {allPlatforms.map((platform) => {
          const isActive = activePlatforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border
                ${
                  isActive
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
                style={{ backgroundColor: platform.color }}
              />
              {platform.name}
              {platform.isCustom && (
                <span className="text-[10px] px-1 py-0.5 rounded bg-purple-100 text-purple-600">
                  커스텀
                </span>
              )}
            </button>
          );
        })}
      </div>
      <Link
        href="/platforms"
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 mt-3 transition-colors"
      >
        <Settings size={14} />
        플랫폼 추가 및 수수료 설정
      </Link>
    </Card>
  );
}

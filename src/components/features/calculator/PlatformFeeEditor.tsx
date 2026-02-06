'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useCustomPlatformStore } from '@/stores/useCustomPlatformStore';
import { getAllPlatforms } from '@/lib/utils/platformUtils';
import { Card } from '@/components/ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function PlatformFeeEditor() {
  const { activePlatforms, platformConfigs, setPlatformConfig } = useCalculatorStore();
  const { customPlatforms } = useCustomPlatformStore();
  const [isOpen, setIsOpen] = useState(false);

  const allPlatforms = getAllPlatforms(customPlatforms);
  const activePlatformConfigs = allPlatforms.filter((p) => activePlatforms.includes(p.id));

  return (
    <Card>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">수수료 설정</h3>
          <p className="text-sm text-gray-500 mt-0.5">플랫폼별 수수료율을 직접 조정할 수 있어요</p>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {activePlatformConfigs.map((platform) => {
            const config = platformConfigs[platform.id];
            const salesRate = config?.salesCommissionRate ?? platform.salesCommission.default;
            const paymentRate = config?.paymentFeeRate ?? platform.paymentFee.default;

            return (
              <div key={platform.id} className="p-3  bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 "
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm font-semibold text-gray-800">{platform.name}</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">판매수수료</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-full px-2 py-1.5  border border-gray-300 text-sm text-right focus:outline-none focus:border-gray-900"
                        value={(salesRate * 100).toFixed(1)}
                        onChange={(e) =>
                          setPlatformConfig(platform.id, {
                            salesCommissionRate: parseFloat(e.target.value) / 100 || 0,
                          })
                        }
                      />
                      <span className="text-xs text-gray-400">%</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {(platform.salesCommission.min * 100).toFixed(1)}~
                      {(platform.salesCommission.max * 100).toFixed(1)}%
                    </p>
                  </div>
                  {platform.paymentFee.max > 0 && (
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">결제수수료</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          className="w-full px-2 py-1.5  border border-gray-300 text-sm text-right focus:outline-none focus:border-gray-900"
                          value={(paymentRate * 100).toFixed(1)}
                          onChange={(e) =>
                            setPlatformConfig(platform.id, {
                              paymentFeeRate: parseFloat(e.target.value) / 100 || 0,
                            })
                          }
                        />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {(platform.paymentFee.min * 100).toFixed(1)}~
                        {(platform.paymentFee.max * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { PlatformConfig } from '@/types/platform';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

interface PlatformFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform?: PlatformConfig;
}

export function PlatformFeeModal({ isOpen, onClose, platform }: PlatformFeeModalProps) {
  const { platformConfigs, setPlatformConfig } = useCalculatorStore();
  const [salesRate, setSalesRate] = useState(0);
  const [paymentRate, setPaymentRate] = useState(0);

  useEffect(() => {
    if (platform) {
      const userConfig = platformConfigs[platform.id];
      setSalesRate((userConfig?.salesCommissionRate ?? platform.salesCommission.default) * 100);
      setPaymentRate((userConfig?.paymentFeeRate ?? platform.paymentFee.default) * 100);
    }
  }, [platform, platformConfigs]);

  if (!isOpen || !platform) return null;

  const handleSave = () => {
    setPlatformConfig(platform.id, {
      salesCommissionRate: salesRate / 100,
      paymentFeeRate: paymentRate / 100,
    });
    onClose();
  };

  const handleReset = () => {
    setSalesRate(platform.salesCommission.default * 100);
    setPaymentRate(platform.paymentFee.default * 100);
    setPlatformConfig(platform.id, {
      salesCommissionRate: platform.salesCommission.default,
      paymentFeeRate: platform.paymentFee.default,
    });
  };

  const hasCustomFees = !!(platformConfigs[platform.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b border-gray-100 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{platform.name} 수수료 설정</h2>
            <p className="text-xs text-gray-500 mt-1">{platform.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Input
              label="판매 수수료"
              type="number"
              step="0.1"
              suffix="%"
              value={salesRate}
              onChange={(e) => setSalesRate(parseFloat(e.target.value) || 0)}
              min={platform.salesCommission.min * 100}
              max={platform.salesCommission.max * 100}
            />
            <p className="text-xs text-gray-400 mt-1">
              범위: {(platform.salesCommission.min * 100).toFixed(1)}% ~ {(platform.salesCommission.max * 100).toFixed(1)}%
            </p>
          </div>

          {platform.paymentFee.max > 0 && (
            <div>
              <Input
                label="결제 수수료"
                type="number"
                step="0.01"
                suffix="%"
                value={paymentRate}
                onChange={(e) => setPaymentRate(parseFloat(e.target.value) || 0)}
                min={platform.paymentFee.min * 100}
                max={platform.paymentFee.max * 100}
              />
              <p className="text-xs text-gray-400 mt-1">
                범위: {(platform.paymentFee.min * 100).toFixed(2)}% ~ {(platform.paymentFee.max * 100).toFixed(2)}%
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-indigo-50 text-xs text-indigo-700">
            <p className="font-semibold mb-1">💡 팁</p>
            <p>플랫폼마다 카테고리별로 수수료가 다릅니다. 내 상품 카테고리의 실제 수수료를 입력하세요.</p>
          </div>

          <div className="flex gap-2 pt-2">
            {hasCustomFees && (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                기본값으로
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

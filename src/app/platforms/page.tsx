'use client';

import { useState } from 'react';
import { useCustomPlatformStore } from '@/stores/useCustomPlatformStore';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useHydration } from '@/hooks/useHydration';
import { Card } from '@/components/ui/Card';
import { PlatformModal } from '@/components/features/platform/PlatformModal';
import { PlatformFeeModal } from '@/components/features/platform/PlatformFeeModal';
import { PLATFORMS } from '@/constants/platforms';
import { PlatformConfig } from '@/types/platform';
import { Plus, Edit2, Trash2, Settings } from 'lucide-react';

export default function PlatformsPage() {
  const hydrated = useHydration();
  const { customPlatforms, addPlatform, updatePlatform, deletePlatform } = useCustomPlatformStore();
  const { platformConfigs } = useCalculatorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<PlatformConfig | undefined>();
  const [editingFeesPlatform, setEditingFeesPlatform] = useState<PlatformConfig | undefined>();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  const handleEdit = (platform: PlatformConfig) => {
    setEditingPlatform(platform);
    setIsModalOpen(true);
  };

  const handleEditFees = (platform: PlatformConfig) => {
    setEditingFeesPlatform(platform);
    setIsFeeModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPlatform(undefined);
    setIsModalOpen(true);
  };

  const handleSave = (platform: PlatformConfig) => {
    if (editingPlatform) {
      updatePlatform(editingPlatform.id, platform);
    } else {
      addPlatform(platform);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('이 플랫폼을 삭제하시겠습니까?')) {
      deletePlatform(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">플랫폼 관리</h2>
        <p className="text-sm text-gray-500 mt-1">
          기본 플랫폼 확인 및 커스텀 플랫폼 추가
        </p>
      </div>

      <div className="space-y-6">
        {/* 기본 플랫폼 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">기본 플랫폼</h3>
            <span className="text-sm text-gray-500">{PLATFORMS.length}개</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PLATFORMS.map((platform) => {
              const userConfig = platformConfigs[platform.id];
              const salesRate = userConfig?.salesCommissionRate ?? platform.salesCommission.default;
              const paymentRate = userConfig?.paymentFeeRate ?? platform.paymentFee.default;
              const hasCustomFees = !!userConfig;
              
              return (
                <Card key={platform.id}>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: platform.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{platform.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {platform.description}
                      </p>
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className={hasCustomFees ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
                          판매 {(salesRate * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className={hasCustomFees ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
                          결제 {(paymentRate * 100).toFixed(2)}%
                        </span>
                      </div>
                      {hasCustomFees && (
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600">
                          커스텀 수수료
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditFees(platform)}
                    className="flex items-center justify-center gap-1.5 w-full mt-3 pt-3 border-t border-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={12} />
                    수수료 설정
                  </button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 커스텀 플랫폼 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">커스텀 플랫폼</h3>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              플랫폼 추가
            </button>
          </div>

          {customPlatforms.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm mb-3">
                  등록된 커스텀 플랫폼이 없습니다
                </p>
                <button
                  onClick={handleAdd}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                >
                  첫 번째 플랫폼 추가하기
                </button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customPlatforms.map((platform) => {
                const userConfig = platformConfigs[platform.id];
                const salesRate = userConfig?.salesCommissionRate ?? platform.salesCommission.default;
                const paymentRate = userConfig?.paymentFeeRate ?? platform.paymentFee.default;
                const hasCustomFees = !!userConfig;

                return (
                  <Card key={platform.id}>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: platform.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{platform.name}</h4>
                        {platform.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {platform.description}
                          </p>
                        )}
                        <div className="mt-2 flex gap-2 text-xs">
                          <span className={hasCustomFees ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
                            판매 {(salesRate * 100).toFixed(1)}%
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className={hasCustomFees ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
                            결제 {(paymentRate * 100).toFixed(2)}%
                          </span>
                        </div>
                        {hasCustomFees && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600">
                            커스텀 수수료
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEditFees(platform)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Settings size={12} />
                        수수료
                      </button>
                      <button
                        onClick={() => handleEdit(platform)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={12} />
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(platform.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={12} />
                        삭제
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <PlatformModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlatform(undefined);
        }}
        onSave={handleSave}
        editingPlatform={editingPlatform}
      />

      <PlatformFeeModal
        isOpen={isFeeModalOpen}
        onClose={() => {
          setIsFeeModalOpen(false);
          setEditingFeesPlatform(undefined);
        }}
        platform={editingFeesPlatform}
      />
    </div>
  );
}

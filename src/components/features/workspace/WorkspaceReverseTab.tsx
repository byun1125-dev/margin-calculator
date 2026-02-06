'use client';

import { useState, useEffect } from 'react';
import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig, PlatformConfig } from '@/types/platform';
import { calculateRequiredPriceAllPlatformsApi } from '@/lib/api/calculations';
import { getTotalCost } from '@/lib/utils/costUtils';
import { useDebounce } from '@/hooks/useDebounce';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { getPlatformMap } from '@/lib/utils/platformUtils';
import { Input } from '@/components/ui/Input';
import type { ReverseCalculationMode } from '@/types/api';

interface WorkspaceReverseTabProps {
  costs: CostBreakdown;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  customPlatforms: PlatformConfig[];
}

export function WorkspaceReverseTab({
  costs,
  activePlatforms,
  platformConfigs,
  customPlatforms,
}: WorkspaceReverseTabProps) {
  const [mode, setMode] = useState<ReverseCalculationMode>('amount');
  const [targetAmount, setTargetAmount] = useState(3000);
  const [targetPercent, setTargetPercent] = useState(30);
  const [requiredPrices, setRequiredPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const platformMap = getPlatformMap(customPlatforms);
  const totalCost = getTotalCost(costs);

  const targetValue = mode === 'amount' ? targetAmount : targetPercent;
  const debouncedTargetValue = useDebounce(targetValue, 300);
  const debouncedCosts = useDebounce(costs, 300);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    calculateRequiredPriceAllPlatformsApi(mode, debouncedTargetValue, debouncedCosts, activePlatforms, platformConfigs)
      .then((data) => {
        if (!cancelled) setRequiredPrices(data);
      })
      .catch(() => {
        if (!cancelled) setRequiredPrices({});
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [mode, debouncedTargetValue, debouncedCosts, activePlatforms, platformConfigs]);

  return (
    <div className="space-y-6">
      {/* 설명 섹션 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
        <h3 className="text-sm font-bold text-indigo-900 mb-2">💡 가격 역산이란?</h3>
        <p className="text-sm text-indigo-800 leading-relaxed">
          <strong>얼마를 남기고 싶은지</strong> 입력하면, 수수료를 고려한
          <strong className="text-indigo-600"> 필요 판매가</strong>를 자동으로 계산해드립니다.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">목표 이익 설정</h3>

          {/* 모드 토글 */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5">
            <button
              onClick={() => setMode('amount')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'amount'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              금액
            </button>
            <button
              onClick={() => setMode('percent')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'percent'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              비율
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          현재 원가: <strong className="text-gray-900">{formatNumber(totalCost)}원</strong>
        </p>

        {mode === 'amount' ? (
          <div className="max-w-xs">
            <Input
              label="목표 순이익 (금액)"
              type="text"
              inputMode="numeric"
              suffix="원"
              value={targetAmount > 0 ? formatNumber(targetAmount) : ''}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/,/g, ''), 10);
                setTargetAmount(isNaN(num) ? 0 : num);
              }}
              placeholder="3000"
            />
            <div className="mt-3 p-3 rounded-lg bg-indigo-50 text-xs text-indigo-700">
              <p className="font-semibold mb-1">예시</p>
              <p>• 원가 10,000원</p>
              <p>• 목표 이익 <strong>3,000원</strong></p>
              <p>• 쿠팡 수수료 10%</p>
              <p className="mt-1 text-indigo-900">→ 필요 판매가: <strong>약 14,444원</strong></p>
              <p className="text-[10px] mt-1 text-indigo-600">
                (14,444원 판매 시 → 수수료 1,444원 제외 → 순이익 3,000원 ✓)
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-xs">
            <Input
              label="목표 마진율 (판매가 대비)"
              type="number"
              suffix="%"
              value={targetPercent}
              onChange={(e) => setTargetPercent(parseFloat(e.target.value) || 0)}
              min={0}
              max={99}
            />
            <p className="text-xs text-gray-500 mt-2">
              판매가의 {targetPercent}%를 순이익으로 남기기
            </p>
            <div className="mt-3 p-3 rounded-lg bg-indigo-50 text-xs text-indigo-700">
              <p className="font-semibold mb-1">예시</p>
              <p>• 원가 10,000원</p>
              <p>• 목표: 판매가의 <strong>30% 마진</strong></p>
              <p>• 쿠팡 수수료 10%</p>
              <p className="mt-1 text-indigo-900">→ 필요 판매가: <strong>약 16,667원</strong></p>
              <p className="text-[10px] mt-1 text-indigo-600">
                (16,667원 판매 시 → 수수료 1,667원, 원가 10,000원 제외 → 순이익 5,000원 = 판매가의 30%)
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {mode === 'amount'
            ? `${formatNumber(targetAmount)}원을 남기려면 이 가격에 팔아야 합니다`
            : `판매가의 ${targetPercent}% 마진을 남기려면 이 가격에 팔아야 합니다`
          }
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          플랫폼별로 수수료가 다르기 때문에 필요한 판매가도 달라집니다
        </p>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">계산 중...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activePlatforms.map((platformId) => {
              const platform = platformMap[platformId];
              const price = requiredPrices[platformId] ?? 0;
              const feeRate = (platformConfigs[platformId]?.salesCommissionRate ?? platform?.salesCommission?.default ?? 0) +
                             (platformConfigs[platformId]?.paymentFeeRate ?? platform?.paymentFee?.default ?? 0);
              const expectedFee = price > 0 ? Math.round(price * feeRate) : 0;
              const expectedProfit = price > 0 ? price - totalCost - expectedFee : 0;

              return (
                <div
                  key={platformId}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    price > 0
                      ? 'bg-white border-indigo-200 hover:border-indigo-300 hover:shadow-md'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: platform?.color ?? '#888' }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {platform?.name ?? platformId}
                        </p>
                        <p className="text-xs text-gray-500">
                          수수료: {(feeRate * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {price > 0 ? (
                        <>
                          <p className="text-2xl font-bold text-indigo-600">
                            {formatNumber(price)}원
                          </p>
                          <p className="text-xs text-emerald-600 font-medium mt-1">
                            순이익: {formatNumber(expectedProfit)}원
                          </p>
                        </>
                      ) : (
                        <div className="text-sm">
                          <p className="font-semibold text-red-600">계산 불가</p>
                          <p className="text-xs text-red-500 mt-1">수수료가 너무 높습니다</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {price > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>판매가</span>
                        <span className="font-medium">{formatNumber(price)}원</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>- 원가</span>
                        <span className="font-medium">-{formatNumber(totalCost)}원</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>- 수수료</span>
                        <span className="font-medium">-{formatNumber(expectedFee)}원</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">순이익</span>
                        <span className="font-bold text-emerald-600">
                          {formatNumber(expectedProfit)}원 ✓
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <h4 className="text-sm font-semibold text-amber-900 mb-2">💡 이렇게 활용하세요</h4>
        <ul className="text-xs text-amber-800 space-y-1.5">
          <li>• <strong>금액 모드:</strong> "3,000원을 남기고 싶다" → 얼마에 팔아야 하는지 계산</li>
          <li>• <strong>비율 모드:</strong> "판매가의 30% 마진을 확보하고 싶다" → 필요 판매가 계산</li>
          <li>• <strong>플랫폼 비교:</strong> 같은 목표라도 수수료에 따라 판매가가 달라짐</li>
          <li>• <strong>가격 책정:</strong> 계산된 판매가를 참고해 실제 상품 등록</li>
        </ul>
      </div>
    </div>
  );
}

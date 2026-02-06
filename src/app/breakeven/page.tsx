'use client';

import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useHydration } from '@/hooks/useHydration';
import { calculateMargin } from '@/lib/calculations/marginCalculator';
import { calculateBreakeven } from '@/lib/calculations/breakevenCalculator';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { PLATFORM_MAP, PLATFORMS } from '@/constants/platforms';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PlatformId } from '@/types/platform';
import { Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export default function BreakevenPage() {
  const hydrated = useHydration();
  const { costs, sellingPrice, activePlatforms, platformConfigs } = useCalculatorStore();
  const { fixedCosts, addFixedCost, updateFixedCost, removeFixedCost } = useSettingsStore();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('coupang');

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  const totalFixedCosts = fixedCosts.reduce((sum, c) => sum + c.amount, 0);

  const marginResult = calculateMargin(
    selectedPlatform,
    sellingPrice,
    costs,
    platformConfigs[selectedPlatform]
  );

  const breakevenResult = calculateBreakeven(marginResult, fixedCosts);

  // 차트 데이터: 0 ~ breakeven * 1.5 범위
  const maxUnits = Math.max(breakevenResult.unitsToBreakeven * 1.5, 100);
  const step = Math.max(1, Math.floor(maxUnits / 20));
  const chartData = [];
  for (let units = 0; units <= maxUnits; units += step) {
    chartData.push({
      units,
      매출: units * sellingPrice,
      총비용: totalFixedCosts + units * (marginResult.totalCost + marginResult.platformFees.totalFees),
    });
  }

  // 전체 플랫폼 손익분기 요약
  const allBreakevens = activePlatforms.map((platformId) => {
    const mr = calculateMargin(platformId, sellingPrice, costs, platformConfigs[platformId]);
    const br = calculateBreakeven(mr, fixedCosts);
    return { platformId, ...br, profitPerUnit: mr.netProfit };
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">손익분기점</h2>
        <p className="text-sm text-gray-500 mt-1">
          월 고정비를 입력하면 몇 개를 팔아야 본전인지 계산해드려요
        </p>
      </div>

      {sellingPrice === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400">계산기에서 판매가와 원가를 먼저 입력해주세요</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card title="월 고정비" description="매달 고정적으로 나가는 비용을 입력하세요">
              <div className="space-y-3">
                {fixedCosts.map((cost) => (
                  <div key={cost.id} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        label="항목"
                        type="text"
                        value={cost.label}
                        onChange={(e) => updateFixedCost(cost.id, { label: e.target.value })}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="금액"
                        type="text"
                        inputMode="numeric"
                        suffix="원"
                        value={cost.amount > 0 ? formatNumber(cost.amount) : ''}
                        onChange={(e) => {
                          const num = parseInt(e.target.value.replace(/,/g, ''), 10);
                          updateFixedCost(cost.id, { amount: isNaN(num) ? 0 : num });
                        }}
                        placeholder="0"
                      />
                    </div>
                    <button
                      onClick={() => removeFixedCost(cost.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addFixedCost({ id: uuidv4(), label: '', amount: 0 })}
                  className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Plus size={16} />
                  항목 추가
                </button>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">월 고정비 합계</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatNumber(totalFixedCosts)}원
                  </span>
                </div>
              </div>
            </Card>

            <Card title="손익분기 차트">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">플랫폼 선택</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as PlatformId)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {PLATFORMS.filter((p) => activePlatforms.includes(p.id)).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="units" tick={{ fontSize: 11 }} label={{ value: '판매 수량', position: 'bottom', fontSize: 11, offset: -5 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                    <Tooltip
                      formatter={(value) => [`${formatNumber(value as number)}원`]}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                    />
                    {breakevenResult.unitsToBreakeven > 0 && (
                      <ReferenceLine
                        x={breakevenResult.unitsToBreakeven}
                        stroke="#6366f1"
                        strokeDasharray="5 5"
                        label={{ value: 'BEP', fontSize: 11, fill: '#6366f1' }}
                      />
                    )}
                    <Line type="monotone" dataKey="매출" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="총비용" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="손익분기점 결과">
              <div className="text-center py-6">
                {breakevenResult.profitPerUnit > 0 ? (
                  <>
                    <p className="text-5xl font-bold text-indigo-600">
                      {formatNumber(breakevenResult.unitsToBreakeven)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">개 판매 시 손익분기</p>
                    <p className="text-lg font-semibold text-gray-700 mt-4">
                      필요 매출: {formatNumber(breakevenResult.revenueToBreakeven)}원
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      개당 순이익: {formatNumber(breakevenResult.profitPerUnit)}원
                    </p>
                  </>
                ) : (
                  <div className="text-red-500">
                    <p className="text-lg font-semibold">손익분기 달성 불가</p>
                    <p className="text-sm mt-1">개당 순이익이 0원 이하입니다. 원가 또는 판매가를 조정해주세요.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card title="플랫폼별 손익분기 비교">
              <div className="space-y-2">
                {allBreakevens.map(({ platformId, unitsToBreakeven, profitPerUnit }) => {
                  const platform = PLATFORM_MAP[platformId];
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
                      <div className="text-right">
                        {profitPerUnit > 0 ? (
                          <>
                            <span className="text-sm font-bold text-gray-900">
                              {formatNumber(unitsToBreakeven)}개
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              (개당 {formatNumber(profitPerUnit)}원)
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-red-500">달성 불가</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig, PlatformConfig } from '@/types/platform';
import { simulateDiscount, generateDiscountCurve } from '@/lib/calculations/discountSimulator';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { getPlatformMap } from '@/lib/utils/platformUtils';
import { Input } from '@/components/ui/Input';
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

interface WorkspaceSimulationTabProps {
  costs: CostBreakdown;
  sellingPrice: number;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  customPlatforms: PlatformConfig[];
}

export function WorkspaceSimulationTab({
  costs,
  sellingPrice,
  activePlatforms,
  platformConfigs,
  customPlatforms,
}: WorkspaceSimulationTabProps) {
  const [discountPercent, setDiscountPercent] = useState(10);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>(activePlatforms[0] || 'coupang');

  const platformMap = getPlatformMap(customPlatforms);

  if (sellingPrice === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">
          판매가를 입력하면 할인 시뮬레이션 결과가 표시됩니다
        </p>
      </div>
    );
  }

  const curveData = generateDiscountCurve(
    selectedPlatform,
    sellingPrice,
    costs,
    platformConfigs[selectedPlatform],
    50,
    5
  );

  const simulationResults = activePlatforms.map((platformId) => {
    const result = simulateDiscount(
      platformId,
      sellingPrice,
      costs,
      discountPercent,
      platformConfigs[platformId]
    );
    return { platformId, ...result };
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">할인 설정</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              할인율: {discountPercent}%
            </label>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 text-sm">
            <p className="text-indigo-700">
              할인가: <strong>{formatNumber(Math.round(sellingPrice * (1 - discountPercent / 100)))}원</strong>
              {' '}(원래 {formatNumber(sellingPrice)}원에서 {formatNumber(Math.round(sellingPrice * discountPercent / 100))}원 할인)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">마진 곡선</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">플랫폼 선택</label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as PlatformId)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-indigo-500"
          >
            {activePlatforms.map((id) => {
              const platform = platformMap[id];
              return (
                <option key={id} value={id}>
                  {platform?.name || id}
                </option>
              );
            })}
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="discount"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: '할인율', position: 'bottom', fontSize: 11, offset: -5 }}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${formatNumber(v)}`} />
              <Tooltip
                formatter={(value, name) => [
                  name === '순이익' ? `${formatNumber(value as number)}원` : `${value}%`,
                  name,
                ]}
                labelFormatter={(label) => `할인율 ${label}%`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <ReferenceLine y={0} stroke="#d1d5db" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="netProfit"
                name="순이익"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">플랫폼별 할인 영향</h3>
        <div className="space-y-3">
          {simulationResults.map(({ platformId, originalMargin, discountedMargin, marginDifference }) => {
            const platform = platformMap[platformId];
            return (
              <div key={platformId} className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: platform?.color ?? '#888' }}
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {platform?.name ?? platformId}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">할인 전</p>
                    <p
                      className={`text-sm font-bold ${
                        originalMargin.isProfit ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {formatNumber(originalMargin.netProfit)}원
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {originalMargin.marginPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">할인 후</p>
                    <p
                      className={`text-sm font-bold ${
                        discountedMargin.isProfit ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {formatNumber(discountedMargin.netProfit)}원
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {discountedMargin.marginPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">차이</p>
                    <p
                      className={`text-sm font-bold ${
                        marginDifference >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {marginDifference >= 0 ? '+' : ''}
                      {formatNumber(marginDifference)}원
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

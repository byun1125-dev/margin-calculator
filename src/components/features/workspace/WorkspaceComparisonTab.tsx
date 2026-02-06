'use client';

import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig, PlatformConfig } from '@/types/platform';
import { calculateAllPlatforms } from '@/lib/calculations/marginCalculator';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { getPlatformMap } from '@/lib/utils/platformUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface WorkspaceComparisonTabProps {
  costs: CostBreakdown;
  sellingPrice: number;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  customPlatforms: PlatformConfig[];
}

export function WorkspaceComparisonTab({
  costs,
  sellingPrice,
  activePlatforms,
  platformConfigs,
  customPlatforms,
}: WorkspaceComparisonTabProps) {
  if (sellingPrice === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">
          판매가를 입력하면 플랫폼별 비교 차트가 표시됩니다
        </p>
      </div>
    );
  }

  const results = calculateAllPlatforms(sellingPrice, costs, activePlatforms, platformConfigs);
  const platformMap = getPlatformMap(customPlatforms);

  const chartData = results.map((r) => ({
    name: r.platformName,
    순이익: r.netProfit,
    마진율: parseFloat(r.marginPercent.toFixed(1)),
    color: platformMap[r.platformId]?.color ?? '#888',
    isProfit: r.isProfit,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">순이익 비교 차트</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${formatNumber(v)}원`} />
              <Tooltip
                formatter={(value) => [`${formatNumber(value as number)}원`, '순이익']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <ReferenceLine y={0} stroke="#d1d5db" />
              <Bar dataKey="순이익" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.isProfit ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">상세 비교표</h3>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 font-medium text-gray-500 sticky left-0 bg-white">
                  플랫폼
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">판매가</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">수수료</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">수수료율</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">순이익</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">마진율</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.platformId} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 sticky left-0 bg-white">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: platformMap[r.platformId]?.color ?? '#888',
                        }}
                      />
                      <span className="font-medium text-gray-900">{r.platformName}</span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3 text-gray-700">
                    {formatNumber(r.sellingPrice)}원
                  </td>
                  <td className="text-right px-4 py-3 text-gray-700">
                    {formatNumber(r.platformFees.totalFees)}원
                  </td>
                  <td className="text-right px-4 py-3 text-gray-700">
                    {(r.platformFees.effectiveFeeRate * 100).toFixed(1)}%
                  </td>
                  <td
                    className={`text-right px-4 py-3 font-semibold ${
                      r.isProfit ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatNumber(r.netProfit)}원
                  </td>
                  <td
                    className={`text-right px-6 py-3 font-semibold ${
                      r.isProfit ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {r.marginPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

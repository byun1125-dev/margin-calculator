'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function SimulationPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/workspace');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <ArrowRight className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">워크스페이스로 이동</h2>
          <p className="text-gray-500">
            할인 시뮬레이션 기능이 <strong>통합 워크스페이스</strong>로 이동되었습니다
          </p>
        </div>
        <button
          onClick={() => router.push('/workspace')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          워크스페이스로 이동
          <ArrowRight size={18} />
        </button>
        <p className="text-xs text-gray-400 mt-4">3초 후 자동으로 이동합니다...</p>
      </div>
    </div>
  );
}
  const hydrated = useHydration();
  const { costs, sellingPrice, activePlatforms, platformConfigs } = useCalculatorStore();
  const [discountPercent, setDiscountPercent] = useState(10);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('coupang');

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  if (sellingPrice === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">할인 시뮬레이션</h2>
        </div>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400">계산기에서 판매가와 원가를 먼저 입력해주세요</p>
          </div>
        </Card>
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">할인 시뮬레이션</h2>
        <p className="text-sm text-gray-500 mt-1">
          할인/쿠폰 적용 시 실제 마진에 미치는 영향을 확인하세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card title="할인 설정">
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

              <div className="p-3 rounded-xl bg-indigo-50 text-sm">
                <p className="text-indigo-700">
                  할인가: <strong>{formatNumber(Math.round(sellingPrice * (1 - discountPercent / 100)))}원</strong>
                  {' '}(원래 {formatNumber(sellingPrice)}원에서 {formatNumber(Math.round(sellingPrice * discountPercent / 100))}원 할인)
                </p>
              </div>
            </div>
          </Card>

          <Card title="마진 곡선">
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
                <LineChart data={curveData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="discount"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{ value: '할인율', position: 'bottom', fontSize: 11, offset: -5 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${formatNumber(v)}`}
                  />
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
          </Card>
        </div>

        <div>
          <Card title="플랫폼별 할인 영향">
            <div className="space-y-3">
              {simulationResults.map(({ platformId, originalMargin, discountedMargin, marginDifference }) => {
                const platform = PLATFORM_MAP[platformId];
                return (
                  <div key={platformId} className="p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: platform?.color ?? '#888' }}
                      />
                      <span className="text-sm font-semibold text-gray-800">
                        {platform?.name ?? platformId}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-0.5">할인 전</p>
                        <p className={`text-sm font-bold ${originalMargin.isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatNumber(originalMargin.netProfit)}원
                        </p>
                        <p className="text-[10px] text-gray-400">{originalMargin.marginPercent.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-0.5">할인 후</p>
                        <p className={`text-sm font-bold ${discountedMargin.isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatNumber(discountedMargin.netProfit)}원
                        </p>
                        <p className="text-[10px] text-gray-400">{discountedMargin.marginPercent.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-0.5">차이</p>
                        <p className={`text-sm font-bold ${marginDifference >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {marginDifference >= 0 ? '+' : ''}{formatNumber(marginDifference)}원
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

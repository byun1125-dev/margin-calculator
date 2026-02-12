'use client';

import { useState, useEffect } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useHydration } from '@/hooks/useHydration';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { calculateAllPlatformsApi } from '@/lib/api/calculations';
import { TrendingUp, Target, DollarSign, Package, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ProductMarginData {
  id: string;
  name: string;
  avgMargin: number;
  valid: boolean;
}

export default function BreakevenPage() {
  const hydrated = useHydration();
  const { products } = useProductStore();
  const { platformConfigs } = useCalculatorStore();

  // 상태 관리
  const [monthlyFixedCost, setMonthlyFixedCost] = useState(2000000); // 월 고정비 (기본 200만)
  const [targetProfit, setTargetProfit] = useState(3000000); // 목표 순수익 (기본 300만)
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [productMargins, setProductMargins] = useState<ProductMarginData[]>([]);
  const [isLoadingMargins, setIsLoadingMargins] = useState(false);

  // 제품별 평균 마진 계산 (API 호출)
  useEffect(() => {
    if (!hydrated || products.length === 0) {
      setProductMargins([]);
      return;
    }

    let cancelled = false;
    setIsLoadingMargins(true);

    const computeMargins = async () => {
      const results: ProductMarginData[] = [];

      for (const product of products) {
        const activePrices = product.sellingPrices.filter((p) => p.isActive && p.sellingPrice > 0);

        if (activePrices.length === 0) {
          results.push({ id: product.id, name: product.name, avgMargin: 0, valid: false });
          continue;
        }

        try {
          // 각 활성 가격의 플랫폼에 대해 마진 계산
          let totalMargin = 0;
          for (const p of activePrices) {
            const marginResults = await calculateAllPlatformsApi(
              p.sellingPrice,
              product.costs,
              [p.platformId],
              { [p.platformId]: platformConfigs[p.platformId] }
            );
            if (marginResults.length > 0) {
              totalMargin += marginResults[0].netProfit;
            }
          }

          const avgMargin = Math.round(totalMargin / activePrices.length);
          results.push({ id: product.id, name: product.name, avgMargin, valid: true });
        } catch {
          results.push({ id: product.id, name: product.name, avgMargin: 0, valid: false });
        }
      }

      if (!cancelled) {
        setProductMargins(results);
        setIsLoadingMargins(false);
      }
    };

    computeMargins();

    return () => { cancelled = true; };
  }, [hydrated, products, platformConfigs]);

  // 계산 로직
  const totalGoal = monthlyFixedCost + targetProfit; // 총 목표 금액

  const currentProfit = productMargins.reduce((sum, product) => {
    const qty = productQuantities[product.id] || 0;
    return sum + (product.avgMargin * qty);
  }, 0);

  const progressPercent = Math.min(100, Math.max(0, (currentProfit / totalGoal) * 100));
  const remainingAmount = Math.max(0, totalGoal - currentProfit);
  const isGoalReached = currentProfit >= totalGoal;

  const handleQuantityChange = (id: string, value: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={24} className="text-gray-900" />
            목표 이익 시뮬레이터
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            이번 달 목표를 위해 어떤 제품을 얼마나 팔아야 할까요? (블록 쌓기)
          </p>
        </div>

        {products.length === 0 && (
          <Link
            href="/products"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white  text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            제품 먼저 등록하기
          </Link>
        )}
      </div>

      {/* 1. 목표 설정 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="1. 목표 설정">
          <div className="space-y-4">
            <Input
              label="월 고정비 (임대료, 인건비 등)"
              type="text"
              inputMode="numeric"
              suffix="원"
              value={formatNumber(monthlyFixedCost)}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/,/g, ''), 10);
                setMonthlyFixedCost(isNaN(val) ? 0 : val);
              }}
            />
            <Input
              label="목표 순수익 (가져갈 돈)"
              type="text"
              inputMode="numeric"
              suffix="원"
              value={formatNumber(targetProfit)}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/,/g, ''), 10);
                setTargetProfit(isNaN(val) ? 0 : val);
              }}
            />
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">총 필요 금액</span>
                <span className="text-xl font-bold text-gray-900">{formatNumber(totalGoal)}원</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">고정비 + 목표수익</p>
            </div>
          </div>
        </Card>

        {/* 2. 대시보드 (게이지) */}
        <div className="md:col-span-2">
          <Card className={`h-full flex flex-col justify-center transition-colors ${isGoalReached ? 'bg-gray-50 border-gray-900' : ''}`}>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {isGoalReached ? '목표 달성! 축하합니다!' : '목표까지 열심히 달려봐요!'}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(currentProfit)}원 <span className="text-base text-gray-400 font-normal">/ {formatNumber(totalGoal)}원</span>
              </p>
              <p className={`text-sm text-red-500 font-medium mt-2 ${isGoalReached ? 'invisible' : 'visible'}`}>
                {formatNumber(remainingAmount)}원 더 벌어야 해요
              </p>
            </div>

            {/* 게이지 바 */}
            <div className="relative h-8 bg-gray-100  overflow-hidden mb-2">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out flex items-center justify-end px-3 ${
                  isGoalReached ? 'bg-emerald-500' : 'bg-gray-1000'
                }`}
                style={{ width: `${progressPercent}%` }}
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">
                  {progressPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* 눈금자 */}
            <div className="flex justify-between text-xs text-gray-400 px-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. 제품 블록 쌓기 게임 */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="text-gray-900" />
          제품별 판매 목표 설정 (블록 쌓기)
        </h3>

        {products.length === 0 ? (
          <div className="bg-gray-50  p-8 text-center border border-gray-200 border-dashed">
            <AlertCircle className="mx-auto text-gray-400 mb-3" size={32} />
            <p className="text-gray-500 mb-4">등록된 제품이 없습니다.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white  text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              제품 등록하러 가기
            </Link>
          </div>
        ) : isLoadingMargins ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">마진 계산 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productMargins.map((product) => {
              if (!product.valid) return null;

              const qty = productQuantities[product.id] || 0;
              const contribution = qty * product.avgMargin;
              const contributionPercent = totalGoal > 0 ? (contribution / totalGoal) * 100 : 0;

              return (
                <div
                  key={product.id}
                  className={`bg-white  border p-4 transition-all ${
                    qty > 0 ? 'border-gray-300  ' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        개당 평균 마진: <span className="text-gray-900 font-semibold">{formatNumber(product.avgMargin)}원</span>
                      </p>
                    </div>
                    {contributionPercent > 0 && (
                      <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 ">
                        {contributionPercent.toFixed(1)}% 기여
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">목표 수량</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(product.id, qty - 10)}
                          className="w-8 h-8  bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                        >
                          -10
                        </button>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center font-bold text-lg border-b-2 border-indigo-100 focus:border-gray-900 focus:outline-none"
                        />
                        <button
                          onClick={() => handleQuantityChange(product.id, qty + 10)}
                          className="w-8 h-8  bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={qty}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      className="w-full accent-gray-900 h-2 bg-gray-100  appearance-none cursor-pointer"
                    />

                    <div className="pt-3 border-t border-gray-50 flex justify-between items-center bg-gray-50 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
                      <span className="text-xs text-gray-500">예상 수익</span>
                      <span className={`font-bold ${contribution > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                        +{formatNumber(contribution)}원
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

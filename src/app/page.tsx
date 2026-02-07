'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useProductStore } from '@/stores/useProductStore';
import { useHydration } from '@/hooks/useHydration';
import { useDebounce } from '@/hooks/useDebounce';
import { getTotalCost } from '@/lib/utils/costUtils';
import { calculateAllPlatformsApi } from '@/lib/api/calculations';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { MarginCalculationResult } from '@/types/calculation';
import { Card } from '@/components/ui/Card';
import {
  Package,
  TrendingUp,
  LayoutDashboard,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const hydrated = useHydration();
  const { costs, sellingPrice, activePlatforms, platformConfigs } = useCalculatorStore();
  const { products } = useProductStore();

  const [results, setResults] = useState<MarginCalculationResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const debouncedSellingPrice = useDebounce(sellingPrice, 300);
  const debouncedCosts = useDebounce(costs, 300);

  useEffect(() => {
    if (!hydrated || debouncedSellingPrice <= 0) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsCalculating(true);

    calculateAllPlatformsApi(debouncedSellingPrice, debouncedCosts, activePlatforms, platformConfigs)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsCalculating(false);
      });

    return () => { cancelled = true; };
  }, [hydrated, debouncedSellingPrice, debouncedCosts, activePlatforms, platformConfigs]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  const bestResult = results.length > 0
    ? results.reduce((best, r) => (r.netProfit > best.netProfit ? r : best), results[0])
    : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard size={24} className="text-gray-900" />
          대시보드
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          현재 작업 중인 계산 결과와 저장된 상품 현황입니다.
        </p>
      </div>

      {/* 상단 요약 카드 (3개) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. 상품 현황 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase">관리 중인 상품</h3>
            <Package size={16} className="text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{products.length}</span>
            <span className="text-xs text-gray-500">개</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/products"
              className="text-xs font-medium text-gray-900 hover:text-gray-600 flex items-center gap-1"
            >
              상품 관리하러 가기 →
            </Link>
          </div>
        </Card>

        {/* 2. 현재 작업 중 (최근 계산) */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase">최근 계산 결과</h3>
            <Layers size={16} className="text-gray-400" />
          </div>
          {isCalculating ? (
            <div className="text-gray-400 text-xs py-2">계산 중...</div>
          ) : sellingPrice > 0 && bestResult ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">최고 수익</span>
                <span className="text-[10px] font-medium text-gray-900 border border-gray-300 px-1.5 py-0.5">
                  {bestResult.platformName}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(bestResult.netProfit)}원
                <span className="text-xs text-gray-400 font-normal ml-1">
                  ({bestResult.marginPercent.toFixed(1)}%)
                </span>
              </p>
            </div>
          ) : (
            <div className="text-gray-400 text-xs py-2">
              아직 계산된 내역이 없습니다.
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/workspace"
              className="text-xs font-medium text-gray-900 hover:text-gray-600 flex items-center gap-1"
            >
              이어서 계산하기 →
            </Link>
          </div>
        </Card>

        {/* 3. 손익분기점 바로가기 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase">목표 달성 시뮬레이터</h3>
            <TrendingUp size={16} className="text-gray-400" />
          </div>
          <p className="text-xs text-gray-600 mb-2">
            이번 달 목표 수익을 위해<br/>무엇을 얼마나 팔아야 할까요?
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/breakeven"
              className="text-xs font-medium text-gray-900 hover:text-gray-600 flex items-center gap-1"
            >
              목표 설정하기 →
            </Link>
          </div>
        </Card>
      </div>

      {/* 저장된 상품 리스트 (메인) */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">최근 저장된 상품</h3>
          <Link href="/products" className="text-xs text-gray-500 hover:text-gray-900">
            전체보기
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            저장된 상품이 없습니다. 상품을 등록해보세요!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    원가 {formatNumber(getTotalCost(product.costs))}원
                    {product.sellingPrices.length > 0 &&
                      ` · 판매가 ${formatNumber(product.sellingPrices[0].sellingPrice)}원 ~`}
                  </p>
                </div>
                <Link
                  href={`/products?edit=${product.id}`}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-2 py-1 hover:border-gray-900 transition-colors"
                >
                  수정
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

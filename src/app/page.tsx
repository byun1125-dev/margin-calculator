'use client';

import Link from 'next/link';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useProductStore } from '@/stores/useProductStore';
import { useHydration } from '@/hooks/useHydration';
import { calculateAllPlatforms, getTotalCost } from '@/lib/calculations/marginCalculator';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { Card } from '@/components/ui/Card';
import {
  Calculator,
  BarChart3,
  Percent,
  TrendingUp,
  Package,
  ArrowRight,
  Layers,
  Settings,
} from 'lucide-react';

const quickLinks = [
  { href: '/workspace', label: '워크스페이스', desc: '플랫폼별 할인·마진·비교·가격역산', icon: Layers, color: 'bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700', highlight: true },
  { href: '/breakeven', label: '손익분기점', desc: '본전 맞추려면 몇 개 팔아야 할까', icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
  { href: '/products', label: '상품 관리', desc: '자주 쓰는 상품 저장/불러오기', icon: Package, color: 'bg-purple-50 text-purple-600' },
  { href: '/platforms', label: '플랫폼 관리', desc: '수수료 설정 및 커스텀 플랫폼 추가', icon: Settings, color: 'bg-gray-50 text-gray-600' },
];

export default function HomePage() {
  const hydrated = useHydration();
  const { costs, sellingPrice, activePlatforms, platformConfigs } = useCalculatorStore();
  const { products } = useProductStore();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  const totalCost = getTotalCost(costs);
  const results = sellingPrice > 0
    ? calculateAllPlatforms(sellingPrice, costs, activePlatforms, platformConfigs)
    : [];

  const bestResult = results.length > 0
    ? results.reduce((best, r) => (r.netProfit > best.netProfit ? r : best), results[0])
    : null;

  const worstResult = results.length > 0
    ? results.reduce((worst, r) => (r.netProfit < worst.netProfit ? r : worst), results[0])
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
        <p className="text-sm text-gray-500 mt-1">마진 계산기 요약 현황</p>
      </div>

      {/* 요약 카드 */}
      {sellingPrice > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <p className="text-xs text-gray-400 mb-1">판매가</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(sellingPrice)}원</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400 mb-1">총 원가</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(totalCost)}원</p>
          </Card>
          {bestResult && (
            <Card>
              <p className="text-xs text-gray-400 mb-1">최고 마진 플랫폼</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatNumber(bestResult.netProfit)}원
              </p>
              <p className="text-xs text-gray-500">{bestResult.platformName}</p>
            </Card>
          )}
          {worstResult && (
            <Card>
              <p className="text-xs text-gray-400 mb-1">최저 마진 플랫폼</p>
              <p className={`text-xl font-bold ${worstResult.isProfit ? 'text-amber-600' : 'text-red-600'}`}>
                {formatNumber(worstResult.netProfit)}원
              </p>
              <p className="text-xs text-gray-500">{worstResult.platformName}</p>
            </Card>
          )}
        </div>
      )}

      {/* 빠른 링크 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className={`hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer h-full relative ${link.highlight ? 'ring-2 ring-indigo-100' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${link.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      {link.label}
                      {link.highlight && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 mt-1" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 저장된 상품 요약 */}
      {products.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">저장된 상품</h3>
            <Link href="/products" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.slice(0, 6).map((product) => (
              <Card key={product.id}>
                <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  원가 {formatNumber(getTotalCost(product.costs))}원
                  {product.sellingPrices[0]?.sellingPrice > 0 &&
                    ` / 판매가 ${formatNumber(product.sellingPrices[0].sellingPrice)}원`}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

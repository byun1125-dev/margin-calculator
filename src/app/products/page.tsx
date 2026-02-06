'use client';

import { useState } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { useHydration } from '@/hooks/useHydration';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatNumber } from '@/lib/utils/formatCurrency';
import { getTotalCost } from '@/lib/utils/costUtils';
import { Package, Plus, Trash2, Copy, ArrowRight, X } from 'lucide-react';
import { DEFAULT_COSTS, DEFAULT_SHIPPING } from '@/constants/defaults';

export default function ProductsPage() {
  const hydrated = useHydration();
  const { products, addProduct, deleteProduct, duplicateProduct } = useProductStore();
  const calculatorStore = useCalculatorStore();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  const handleSaveCurrentAsProduct = () => {
    if (!newName.trim()) return;
    addProduct({
      name: newName.trim(),
      costs: calculatorStore.costs,
      sellingPrices: calculatorStore.activePlatforms.map((p) => ({
        platformId: p,
        sellingPrice: calculatorStore.sellingPrice,
        isActive: true,
      })),
      shippingConfig: calculatorStore.shippingConfig,
    });
    setNewName('');
    setShowForm(false);
  };

  const handleLoadProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    calculatorStore.setCosts(product.costs);
    if (product.sellingPrices.length > 0) {
      calculatorStore.setSellingPrice(product.sellingPrices[0].sellingPrice);
    }
    calculatorStore.setShippingConfig(product.shippingConfig);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">상품 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            자주 계산하는 상품을 저장하고 불러올 수 있어요
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          현재 설정 저장
        </button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="상품명"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="예: 핸드크림 30ml"
                autoFocus
              />
            </div>
            <button
              onClick={handleSaveCurrentAsProduct}
              disabled={!newName.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              저장
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            현재 계산기에 입력된 원가/판매가/플랫폼 설정이 함께 저장됩니다
          </p>
        </Card>
      )}

      {products.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 text-sm">저장된 상품이 없어요</p>
            <p className="text-gray-400 text-xs mt-1">
              계산기에서 원가를 입력한 후 &quot;현재 설정 저장&quot; 버튼을 눌러보세요
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => {
            const totalCost = getTotalCost(product.costs);
            const mainPrice = product.sellingPrices[0]?.sellingPrice ?? 0;

            return (
              <Card key={product.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(product.updatedAt).toLocaleDateString('ko-KR')} 수정
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">총 원가</span>
                    <span className="font-medium text-gray-900">{formatNumber(totalCost)}원</span>
                  </div>
                  {mainPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">판매가</span>
                      <span className="font-medium text-gray-900">{formatNumber(mainPrice)}원</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLoadProduct(product.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    <ArrowRight size={14} />
                    불러오기
                  </button>
                  <button
                    onClick={() => duplicateProduct(product.id)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

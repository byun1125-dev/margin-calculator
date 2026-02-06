'use client';

import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { formatNumber } from '@/lib/utils/formatCurrency';

export function CostInputForm() {
  const { costs, setCosts, sellingPrice, setSellingPrice } = useCalculatorStore();

  const totalCost =
    costs.manufacturingCost +
    costs.packagingCost +
    costs.shippingCost +
    costs.otherCosts.reduce((sum, c) => sum + c.amount, 0);

  const handleNumberInput = (
    field: 'manufacturingCost' | 'packagingCost' | 'shippingCost',
    value: string
  ) => {
    const num = parseInt(value.replace(/,/g, ''), 10);
    setCosts({ [field]: isNaN(num) ? 0 : num });
  };

  const addOtherCost = () => {
    setCosts({
      otherCosts: [...costs.otherCosts, { id: uuidv4(), label: '', amount: 0 }],
    });
  };

  const removeOtherCost = (id: string) => {
    setCosts({
      otherCosts: costs.otherCosts.filter((c) => c.id !== id),
    });
  };

  const updateOtherCost = (id: string, field: 'label' | 'amount', value: string) => {
    setCosts({
      otherCosts: costs.otherCosts.map((c) =>
        c.id === id
          ? {
              ...c,
              [field]: field === 'amount' ? parseInt(value.replace(/,/g, ''), 10) || 0 : value,
            }
          : c
      ),
    });
  };

  return (
    <div className="space-y-4">
      <Card title="판매가" description="고객이 결제하는 금액">
        <Input
          label="판매가"
          type="text"
          inputMode="numeric"
          suffix="원"
          value={sellingPrice > 0 ? formatNumber(sellingPrice) : ''}
          onChange={(e) => {
            const num = parseInt(e.target.value.replace(/,/g, ''), 10);
            setSellingPrice(isNaN(num) ? 0 : num);
          }}
          placeholder="0"
        />
      </Card>

      <Card title="원가 입력" description="상품 1개당 들어가는 비용">
        <div className="space-y-3">
          <Input
            label="제조원가"
            type="text"
            inputMode="numeric"
            suffix="원"
            value={costs.manufacturingCost > 0 ? formatNumber(costs.manufacturingCost) : ''}
            onChange={(e) => handleNumberInput('manufacturingCost', e.target.value)}
            placeholder="0"
          />
          <Input
            label="포장비"
            type="text"
            inputMode="numeric"
            suffix="원"
            value={costs.packagingCost > 0 ? formatNumber(costs.packagingCost) : ''}
            onChange={(e) => handleNumberInput('packagingCost', e.target.value)}
            placeholder="0"
          />
          <Input
            label="배송비 (판매자 부담)"
            type="text"
            inputMode="numeric"
            suffix="원"
            value={costs.shippingCost > 0 ? formatNumber(costs.shippingCost) : ''}
            onChange={(e) => handleNumberInput('shippingCost', e.target.value)}
            placeholder="0"
          />

          {costs.otherCosts.map((cost) => (
            <div key={cost.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label="항목명"
                  type="text"
                  value={cost.label}
                  onChange={(e) => updateOtherCost(cost.id, 'label', e.target.value)}
                  placeholder="예: 마케팅비"
                />
              </div>
              <div className="flex-1">
                <Input
                  label="금액"
                  type="text"
                  inputMode="numeric"
                  suffix="원"
                  value={cost.amount > 0 ? formatNumber(cost.amount) : ''}
                  onChange={(e) => updateOtherCost(cost.id, 'amount', e.target.value)}
                  placeholder="0"
                />
              </div>
              <button
                onClick={() => removeOtherCost(cost.id)}
                className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={addOtherCost}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
          >
            <Plus size={16} />
            기타 비용 추가
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">총 원가</span>
          <span className="text-lg font-bold text-gray-900">
            {formatNumber(totalCost)}원
          </span>
        </div>
      </Card>
    </div>
  );
}

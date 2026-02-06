import { CostBreakdown, ShippingConfig } from '@/types/product';
import { FixedCostItem } from '@/types/calculation';

export const DEFAULT_COSTS: CostBreakdown = {
  manufacturingCost: 0,
  packagingCost: 0,
  shippingCost: 0,
  otherCosts: [],
};

export const DEFAULT_SHIPPING: ShippingConfig = {
  isFreeShipping: true,
  freeShippingThreshold: 0,
  shippingFeeToCustomer: 3000,
};

export const DEFAULT_FIXED_COSTS: FixedCostItem[] = [
  { id: 'rent', label: '임대료', amount: 0 },
  { id: 'labor', label: '인건비', amount: 0 },
  { id: 'utilities', label: '관리비', amount: 0 },
  { id: 'marketing', label: '마케팅비', amount: 0 },
];

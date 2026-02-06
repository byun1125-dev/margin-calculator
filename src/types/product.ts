import { PlatformId } from './platform';

export interface OtherCost {
  id: string;
  label: string;
  amount: number;
}

export interface CostBreakdown {
  manufacturingCost: number;
  packagingCost: number;
  shippingCost: number;
  otherCosts: OtherCost[];
}

export interface ShippingConfig {
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  shippingFeeToCustomer: number;
}

export interface PlatformPrice {
  platformId: PlatformId;
  sellingPrice: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  costs: CostBreakdown;
  sellingPrices: PlatformPrice[];
  shippingConfig: ShippingConfig;
}

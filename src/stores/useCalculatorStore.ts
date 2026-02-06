'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CostBreakdown, ShippingConfig } from '@/types/product';
import { PlatformId, PlatformUserConfig } from '@/types/platform';
import { DEFAULT_COSTS, DEFAULT_SHIPPING } from '@/constants/defaults';
import { DEFAULT_PLATFORM_IDS } from '@/constants/platformIds';

interface CalculatorState {
  costs: CostBreakdown;
  sellingPrice: number;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  shippingConfig: ShippingConfig;

  setCosts: (costs: Partial<CostBreakdown>) => void;
  setSellingPrice: (price: number) => void;
  togglePlatform: (platformId: PlatformId) => void;
  setPlatformConfig: (platformId: PlatformId, config: Partial<PlatformUserConfig>) => void;
  setShippingConfig: (config: Partial<ShippingConfig>) => void;
  reset: () => void;
}

const initialState = {
  costs: DEFAULT_COSTS,
  sellingPrice: 0,
  activePlatforms: DEFAULT_PLATFORM_IDS,
  platformConfigs: {} as Partial<Record<PlatformId, Partial<PlatformUserConfig>>>,
  shippingConfig: DEFAULT_SHIPPING,
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      ...initialState,

      setCosts: (costs) =>
        set((state) => ({ costs: { ...state.costs, ...costs } })),

      setSellingPrice: (price) => set({ sellingPrice: price }),

      togglePlatform: (platformId) =>
        set((state) => ({
          activePlatforms: state.activePlatforms.includes(platformId)
            ? state.activePlatforms.filter((id) => id !== platformId)
            : [...state.activePlatforms, platformId],
        })),

      setPlatformConfig: (platformId, config) =>
        set((state) => ({
          platformConfigs: {
            ...state.platformConfigs,
            [platformId]: { ...state.platformConfigs[platformId], ...config },
          },
        })),

      setShippingConfig: (config) =>
        set((state) => ({ shippingConfig: { ...state.shippingConfig, ...config } })),

      reset: () => set(initialState),
    }),
    { name: 'margin-calculator' }
  )
);

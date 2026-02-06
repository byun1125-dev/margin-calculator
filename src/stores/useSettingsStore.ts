'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FixedCostItem } from '@/types/calculation';
import { DEFAULT_FIXED_COSTS } from '@/constants/defaults';

interface SettingsState {
  fixedCosts: FixedCostItem[];
  setFixedCosts: (costs: FixedCostItem[]) => void;
  addFixedCost: (cost: FixedCostItem) => void;
  updateFixedCost: (id: string, updates: Partial<FixedCostItem>) => void;
  removeFixedCost: (id: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fixedCosts: DEFAULT_FIXED_COSTS,

      setFixedCosts: (costs) => set({ fixedCosts: costs }),

      addFixedCost: (cost) =>
        set((state) => ({ fixedCosts: [...state.fixedCosts, cost] })),

      updateFixedCost: (id, updates) =>
        set((state) => ({
          fixedCosts: state.fixedCosts.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeFixedCost: (id) =>
        set((state) => ({
          fixedCosts: state.fixedCosts.filter((c) => c.id !== id),
        })),
    }),
    { name: 'margin-settings' }
  )
);

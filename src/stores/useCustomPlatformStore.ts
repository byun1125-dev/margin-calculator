'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlatformConfig, PlatformId } from '@/types/platform';

interface CustomPlatformState {
  customPlatforms: PlatformConfig[];
  addPlatform: (platform: PlatformConfig) => void;
  updatePlatform: (id: PlatformId, platform: Partial<PlatformConfig>) => void;
  deletePlatform: (id: PlatformId) => void;
}

export const useCustomPlatformStore = create<CustomPlatformState>()(
  persist(
    (set) => ({
      customPlatforms: [],

      addPlatform: (platform) =>
        set((state) => ({
          customPlatforms: [...state.customPlatforms, { ...platform, isCustom: true }],
        })),

      updatePlatform: (id, updates) =>
        set((state) => ({
          customPlatforms: state.customPlatforms.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePlatform: (id) =>
        set((state) => ({
          customPlatforms: state.customPlatforms.filter((p) => p.id !== id),
        })),
    }),
    { name: 'custom-platforms' }
  )
);

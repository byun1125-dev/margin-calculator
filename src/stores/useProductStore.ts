'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from './useAuthStore';
import {
  saveProduct as firestoreSave,
  updateFirestoreProduct,
  deleteFirestoreProduct,
} from '@/lib/firestore/products';

function getUid(): string | null {
  return useAuthStore.getState().user?.uid ?? null;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  duplicateProduct: (id: string) => void;
  /** Firestore에서 불러온 상품으로 로컬 상태 교체 */
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));

        const uid = getUid();
        if (uid) {
          firestoreSave(uid, newProduct).catch(console.error);
        }
      },

      updateProduct: (id, updates) => {
        const updatesWithTime = { ...updates, updatedAt: new Date().toISOString() };
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatesWithTime } : p
          ),
        }));

        const uid = getUid();
        if (uid) {
          updateFirestoreProduct(uid, id, updatesWithTime).catch(console.error);
        }
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        const uid = getUid();
        if (uid) {
          deleteFirestoreProduct(uid, id).catch(console.error);
        }
      },

      getProduct: (id) => get().products.find((p) => p.id === id),

      duplicateProduct: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (product) {
          const { id: _, createdAt: __, updatedAt: ___, ...rest } = product;
          get().addProduct({ ...rest, name: `${rest.name} (복사)` });
        }
      },

      setProducts: (products) => set({ products }),
    }),
    { name: 'margin-products' }
  )
);

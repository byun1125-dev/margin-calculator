'use client';

import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProductStore } from '@/stores/useProductStore';
import { fetchProducts, syncLocalToFirestore } from '@/lib/firestore/products';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user && syncedRef.current !== user.uid) {
        syncedRef.current = user.uid;

        try {
          const localProducts = useProductStore.getState().products;
          const firestoreProducts = await fetchProducts(user.uid);

          if (firestoreProducts.length > 0) {
            // Firestore에 상품이 있으면 불러오기
            // 로컬에만 있는 상품이 있으면 Firestore에도 업로드
            const firestoreIds = new Set(firestoreProducts.map((p) => p.id));
            const localOnly = localProducts.filter((p) => !firestoreIds.has(p.id));

            if (localOnly.length > 0) {
              await syncLocalToFirestore(user.uid, localOnly);
              useProductStore.getState().setProducts([...firestoreProducts, ...localOnly]);
            } else {
              useProductStore.getState().setProducts(firestoreProducts);
            }
          } else if (localProducts.length > 0) {
            // Firestore는 비어있고 로컬에 상품이 있으면 업로드
            await syncLocalToFirestore(user.uid, localProducts);
          }
        } catch (err) {
          console.error('Firestore 동기화 실패:', err);
        }
      }

      if (!user) {
        syncedRef.current = null;
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}

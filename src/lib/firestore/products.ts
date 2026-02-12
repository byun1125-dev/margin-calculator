import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/product';

function productsRef(uid: string) {
  return collection(db, 'users', uid, 'products');
}

function productDocRef(uid: string, productId: string) {
  return doc(db, 'users', uid, 'products', productId);
}

/** Firestore에서 사용자의 모든 상품 불러오기 */
export async function fetchProducts(uid: string): Promise<Product[]> {
  const snapshot = await getDocs(productsRef(uid));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

/** Firestore에 상품 저장 (새 상품 또는 덮어쓰기) */
export async function saveProduct(uid: string, product: Product): Promise<void> {
  const { id, ...data } = product;
  await setDoc(productDocRef(uid, id), data);
}

/** Firestore 상품 부분 업데이트 */
export async function updateFirestoreProduct(
  uid: string,
  productId: string,
  updates: Partial<Product>
): Promise<void> {
  const { id: _, ...data } = updates;
  await updateDoc(productDocRef(uid, productId), data);
}

/** Firestore에서 상품 삭제 */
export async function deleteFirestoreProduct(
  uid: string,
  productId: string
): Promise<void> {
  await deleteDoc(productDocRef(uid, productId));
}

/** 로컬 상품을 Firestore에 일괄 업로드 (최초 동기화) */
export async function syncLocalToFirestore(
  uid: string,
  localProducts: Product[]
): Promise<void> {
  const promises = localProducts.map((product) => saveProduct(uid, product));
  await Promise.all(promises);
}

import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// 환경 변수 입력 없이 바로 배포되도록 값을 직접 입력했습니다.
const firebaseConfig = {
  apiKey: "AIzaSyAgwLQW7OtiYJQXR8JXhh3TVCZUrM6s_ds",
  authDomain: "margin-1bf49.firebaseapp.com",
  projectId: "margin-1bf49",
  storageBucket: "margin-1bf49.firebasestorage.app",
  messagingSenderId: "119337661808",
  appId: "1:119337661808:web:f0c440762bc17d96e10bb5",
  measurementId: "G-CS71XSYGVK",
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth (로그인 상태를 localStorage에 유지 - 탭/브라우저 닫아도 유지)
const auth = getAuth(app);
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence);
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };

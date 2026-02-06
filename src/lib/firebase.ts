import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';

// 환경 변수 입력 없이 바로 배포되도록 값을 직접 입력했습니다.
const firebaseConfig = {
  apiKey: "AIzaSyAzEcP0cQBuN8KCJ4a_24Ig9aMoTjYqp8g",
  authDomain: "margin-8a4fb.firebaseapp.com",
  projectId: "margin-8a4fb",
  storageBucket: "margin-8a4fb.firebasestorage.app",
  messagingSenderId: "627452716991",
  appId: "1:627452716991:web:f0cf3d3f3e9222d24ea30a",
  measurementId: "G-Z2R3JHTVDE",
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };

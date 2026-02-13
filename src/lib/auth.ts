import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 인앱 브라우저 감지 (Instagram, Threads, Facebook, KakaoTalk, LINE, Naver 등)
export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  // 주요 인앱 브라우저 + 일반 WebView 감지
  return /FBAN|FBAV|Instagram|Threads|Barcelona|KAKAOTALK|Line\/|NAVER|Daum|wv|WebView/i.test(ua);
}

// 이메일 회원가입
export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  return userCredential.user;
}

// 이메일 로그인
export async function signInWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// 구글 로그인 (인앱 브라우저에서는 redirect 방식 사용)
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  if (isInAppBrowser()) {
    // 인앱 브라우저에서는 signInWithRedirect 사용
    await signInWithRedirect(auth, provider);
    // redirect 후 페이지가 다시 로드되므로 여기서 return
    return null;
  }

  // 일반 브라우저에서는 기존 popup 방식 유지
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

// redirect 결과 처리 (페이지 로드 시 호출)
export async function handleGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (err) {
    console.error('Google redirect 결과 처리 실패:', err);
    return null;
  }
}

// 로그아웃
export async function logout() {
  await signOut(auth);
}

// 비밀번호 재설정 이메일 전송
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

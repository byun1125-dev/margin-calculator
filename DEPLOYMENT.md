# 🚀 Netlify 자동 배포 가이드

## 📋 준비사항

- ✅ GitHub 계정
- ✅ Netlify 계정 (없으면 GitHub로 가입)
- ✅ Firebase 프로젝트 설정 완료

---

## 1️⃣ GitHub에 코드 푸시

```bash
# Git 초기화 (이미 되어있으면 스킵)
git init
git add .
git commit -m "Initial commit"

# GitHub 레포지토리와 연결
git remote add origin https://github.com/your-username/margin-calculator.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ Netlify에 사이트 생성

### 방법 1: Netlify 웹사이트에서

1. [Netlify](https://www.netlify.com/) 로그인
2. **"Add new site"** 클릭
3. **"Import an existing project"** 선택
4. **GitHub** 선택 후 레포지토리 연결
5. 빌드 설정은 자동으로 감지됨 (netlify.toml 파일 기반)
6. **"Deploy site"** 클릭

### 방법 2: Netlify CLI로 (선택)

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# Netlify 로그인
netlify login

# 사이트 생성 및 배포
netlify init
```

---

## 3️⃣ 환경 변수 설정

Netlify 대시보드에서:

1. **Site settings** > **Environment variables** 이동
2. 다음 환경 변수들을 추가:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyAzEcP0cQBuN8KCJ4a_24Ig9aMoTjYqp8g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = margin-8a4fb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = margin-8a4fb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = margin-8a4fb.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 627452716991
NEXT_PUBLIC_FIREBASE_APP_ID = 1:627452716991:web:f0cf3d3f3e9222d24ea30a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-Z2R3JHTVDE
```

3. **"Save"** 클릭
4. **"Trigger deploy"** > **"Deploy site"** 클릭 (환경 변수 적용)

---

## 4️⃣ 자동 배포 설정 완료! 🎉

이제 GitHub에 코드를 푸시하면 **자동으로 배포**됩니다!

```bash
# 코드 수정 후
git add .
git commit -m "Update features"
git push

# 자동으로 Netlify가 감지하고 배포 시작!
```

---

## 📊 배포 상태 확인

- **Netlify 대시보드**: https://app.netlify.com/
- **배포 로그**: Site overview > Deploys
- **실시간 로그**: 각 배포 클릭 > Deploy log

---

## 🔧 트러블슈팅

### 빌드 실패 시

1. **로그 확인**: Netlify 대시보드에서 에러 메시지 확인
2. **로컬 빌드 테스트**:
   ```bash
   npm run build
   ```
3. **환경 변수 확인**: 모든 NEXT_PUBLIC_* 변수가 설정되었는지 확인

### 배포는 성공했는데 앱이 안 열릴 때

1. **브라우저 콘솔 확인**: F12 > Console 탭
2. **Firebase 설정 확인**: 환경 변수가 올바른지 확인
3. **캐시 클리어**: Shift + F5로 새로고침

---

## 🌐 커스텀 도메인 설정 (선택)

1. Netlify 대시보드 > **Domain settings**
2. **Add custom domain** 클릭
3. 도메인 입력 후 DNS 설정 안내 따라하기

---

## 📝 배포 브랜치 변경

기본적으로 `main` 브랜치가 배포됩니다.
다른 브랜치로 변경하려면:

1. **Site settings** > **Build & deploy** > **Deploy contexts**
2. **Production branch** 변경

---

## ⚡ 배포 속도 최적화

- **빌드 캐싱**: 자동으로 적용됨
- **이미지 최적화**: Next.js 자동 최적화 활성화됨
- **CDN**: Netlify CDN 자동 적용

---

## 🎯 배포 완료!

이제 코드를 수정하고 GitHub에 푸시만 하면
**자동으로 Netlify가 빌드하고 배포**합니다!

배포된 사이트 URL: `https://your-site-name.netlify.app`

# 🎯 Firebase & Netlify 설정 완료!

## ✅ 완료된 작업

### 1. Firebase 연결
- ✅ Firebase SDK 설치 완료
- ✅ 환경 변수 설정 완료 (`.env.local`)
- ✅ Firebase 설정 파일 생성 (`src/lib/firebase.ts`)
- ✅ Analytics 연동 준비 완료

### 2. Netlify 배포 준비
- ✅ Netlify 설정 파일 생성 (`netlify.toml`)
- ✅ Next.js 플러그인 설치
- ✅ 빌드 설정 완료
- ✅ 환경 변수 안전하게 관리 (`.gitignore`)

### 3. 문서 작성
- ✅ 배포 가이드 (`DEPLOYMENT.md`)
- ✅ README 작성
- ✅ 프로젝트 설명서

---

## 🚀 이제 배포하기

### 단계 1: GitHub에 푸시

```bash
# 모든 변경사항 추가
git add .

# 커밋
git commit -m "Add Firebase integration and Netlify deployment setup"

# GitHub에 푸시
git push origin main
```

**📝 Note**: `.env.local` 파일은 자동으로 제외됩니다 (`.gitignore`에 포함됨)

---

### 단계 2: Netlify 배포

#### 방법 A: Netlify 웹사이트 (추천)

1. **https://app.netlify.com/** 접속
2. **"Add new site"** > **"Import an existing project"**
3. **GitHub** 선택
4. 레포지토리 선택: `margin-calculator`
5. 빌드 설정 확인:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - ✅ 자동으로 감지됨 (`netlify.toml` 파일 기반)
6. **"Deploy site"** 클릭

#### 방법 B: Netlify CLI

```bash
# CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 초기화 & 배포
netlify init
```

---

### 단계 3: 환경 변수 설정

Netlify 대시보드에서:

1. **Site settings** > **Environment variables**
2. **"Add a variable"** 클릭
3. 다음 7개 변수를 추가:

```
변수명                                        값
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_FIREBASE_API_KEY                AIzaSyAzEcP0cQBuN8KCJ4a_24Ig9aMoTjYqp8g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN            margin-8a4fb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID             margin-8a4fb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET         margin-8a4fb.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID    627452716991
NEXT_PUBLIC_FIREBASE_APP_ID                 1:627452716991:web:f0cf3d3f3e9222d24ea30a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID         G-Z2R3JHTVDE
```

4. **"Save"** 클릭
5. **"Trigger deploy"** > **"Deploy site"** (환경 변수 적용)

---

### 단계 4: 배포 확인

1. **Netlify 대시보드**에서 배포 진행 상황 확인
2. 빌드 로그 확인 (보통 3-5분 소요)
3. 배포 완료 후 자동 생성된 URL로 접속:
   ```
   https://your-site-name.netlify.app
   ```

---

## 🔄 자동 배포 완료!

이제부터는:

```bash
# 코드 수정
git add .
git commit -m "Update features"
git push

# → Netlify가 자동으로 감지하고 배포 시작! 🎉
```

---

## 📊 배포 후 체크리스트

- [ ] 사이트가 정상적으로 열리나요?
- [ ] Firebase Analytics가 작동하나요? (개발자 도구 > Console 확인)
- [ ] 모든 페이지가 잘 작동하나요?
  - [ ] 워크스페이스
  - [ ] 플랫폼 관리
  - [ ] 상품 관리
  - [ ] 손익분기점
- [ ] 데이터가 로컬 스토리지에 잘 저장되나요?
- [ ] 할인 기능이 작동하나요?

---

## 🎨 커스텀 도메인 설정 (선택)

나만의 도메인을 연결하려면:

1. Netlify 대시보드 > **Domain settings**
2. **Add custom domain**
3. 도메인 입력 (예: `margin-calculator.com`)
4. DNS 설정 안내 따라하기

---

## 🐛 문제 해결

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 후 수정
git add .
git commit -m "Fix build error"
git push
```

### Firebase 작동 안 함

1. Netlify 환경 변수가 올바른지 확인
2. 모든 `NEXT_PUBLIC_*` 변수가 설정되었는지 확인
3. 재배포: **Trigger deploy** > **Clear cache and deploy site**

### 페이지가 안 열림

1. **브라우저 콘솔 확인** (F12 > Console)
2. **Netlify 배포 로그** 확인
3. **404 에러**: `netlify.toml`의 redirects 설정 확인

---

## 📞 도움이 필요하면

- **Netlify 문서**: https://docs.netlify.com/
- **Next.js 문서**: https://nextjs.org/docs
- **Firebase 문서**: https://firebase.google.com/docs

---

## 🎉 축하합니다!

마진 계산기가 성공적으로 배포되었습니다!

배포된 사이트를 친구들과 공유하세요! 🚀

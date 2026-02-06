# 📊 마진 계산기

스몰 브랜드를 위한 플랫폼별 마진 계산 & 수익 분석 도구

## ✨ 주요 기능

### 🎯 통합 워크스페이스
- **플랫폼별 할인 설정**: 각 플랫폼마다 다른 할인율 적용 가능
- **실시간 마진 계산**: 할인 적용된 실제 순이익 즉시 확인
- **플랫폼 비교**: 차트와 표로 한눈에 비교
- **가격 역산**: 목표 마진을 입력하면 필요한 판매가 자동 계산

### 🏪 플랫폼 관리
- **기본 플랫폼**: 쿠팡, 네이버, 카카오 등 11개 플랫폼 지원
- **커스텀 플랫폼**: 직접 플랫폼 추가 가능
- **수수료 커스터마이징**: 카테고리별 실제 수수료 설정

### 📈 손익분기점 분석
- 고정비 입력으로 필요 판매량 계산
- 월별 목표 설정

### 💾 상품 관리
- 자주 사용하는 상품 저장
- 빠른 불러오기

---

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# http://localhost:3000 에서 확인
```

---

## 🌐 배포

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md) 참고

### 간단 요약

1. GitHub에 코드 푸시
2. Netlify에서 레포지토리 연결
3. 환경 변수 설정
4. 자동 배포 완료!

---

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Charts**: Recharts
- **Database**: Firebase (optional)
- **Deployment**: Netlify

---

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── workspace/         # 통합 워크스페이스
│   ├── platforms/         # 플랫폼 관리
│   ├── products/          # 상품 관리
│   └── breakeven/         # 손익분기점
├── components/            # React 컴포넌트
│   ├── features/         # 기능별 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── ui/               # 공통 UI 컴포넌트
├── lib/                   # 유틸리티 & 계산 로직
│   ├── calculations/     # 마진, 역산, 할인 계산
│   └── utils/            # 포맷, 플랫폼 유틸
├── stores/               # Zustand 상태 관리
├── types/                # TypeScript 타입 정의
└── constants/            # 상수 (플랫폼 정보 등)
```

---

## 💡 사용 예시

### 1. 워크스페이스에서 마진 계산

```
원가: 10,000원
판매가: 42,000원

쿠팡 (20% 할인):
→ 할인가: 33,600원
→ 순이익: 18,740원 (마진 55.8%)

네이버 (10% 할인):
→ 할인가: 37,800원
→ 순이익: 25,910원 (마진 68.5%)
```

### 2. 가격 역산

```
원가: 10,000원
목표: 60% 마진 확보

쿠팡 (수수료 10%):
→ 필요 판매가: 33,333원
```

---

## 🔐 환경 변수

`.env.local` 파일 생성:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📝 License

MIT

---

## 👤 Author

**Margin Calculator Team**

- 이슈 제보: GitHub Issues
- 문의: [이메일 주소]

---

## 🙏 Acknowledgments

스몰 브랜드 운영자분들의 피드백으로 만들어졌습니다.

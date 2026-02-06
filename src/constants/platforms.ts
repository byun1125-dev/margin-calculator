import { PlatformConfig } from '@/types/platform';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'coupang',
    name: '쿠팡',
    color: '#E4002B',
    salesCommission: { min: 0.04, max: 0.109, default: 0.10 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리별 4~10.9%, 결제수수료 포함',
  },
  {
    id: 'naver-smartstore',
    name: '네이버 스마트스토어',
    color: '#03C75A',
    salesCommission: { min: 0.0091, max: 0.0273, default: 0.0273 },
    paymentFee: { min: 0.0198, max: 0.0363, default: 0.0198 },
    description: '판매수수료 0.91~2.73% + 네이버페이 결제수수료 1.98~3.63%',
  },
  {
    id: 'kakao-gift',
    name: '카카오톡 선물하기',
    color: '#FEE500',
    salesCommission: { min: 0.10, max: 0.35, default: 0.30 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리별 10~35%, 결제수수료 포함',
  },
  {
    id: 'own-mall',
    name: '자사몰',
    color: '#6366F1',
    salesCommission: { min: 0, max: 0, default: 0 },
    paymentFee: { min: 0.019, max: 0.035, default: 0.033 },
    description: 'PG 결제수수료만 1.9~3.5%',
  },
  {
    id: 'musinsa',
    name: '무신사',
    color: '#000000',
    salesCommission: { min: 0.10, max: 0.35, default: 0.20 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리/입점형태별 10~35%, 결제수수료 포함',
  },
  {
    id: '29cm',
    name: '29CM',
    color: '#FF4D00',
    salesCommission: { min: 0.10, max: 0.30, default: 0.20 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리별 10~30%, 결제수수료 포함',
  },
  {
    id: 'wconcept',
    name: 'W컨셉',
    color: '#1A1A1A',
    salesCommission: { min: 0.10, max: 0.30, default: 0.20 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리별 10~30%, 결제수수료 포함',
  },
  {
    id: 'ably',
    name: '에이블리',
    color: '#FF2D55',
    salesCommission: { min: 0.03, max: 0.20, default: 0.10 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리별 3~20%, 결제수수료 포함',
  },
  {
    id: 'zigzag',
    name: '지그재그',
    color: '#FF4081',
    salesCommission: { min: 0.03, max: 0.20, default: 0.10 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리별 3~20%, 결제수수료 포함',
  },
  {
    id: 'ohouse',
    name: '오늘의집',
    color: '#35C5F0',
    salesCommission: { min: 0.10, max: 0.25, default: 0.15 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '카테고리별 10~25%, 결제수수료 포함',
  },
  {
    id: 'idus',
    name: '아이디어스',
    color: '#FF6F61',
    salesCommission: { min: 0.15, max: 0.25, default: 0.20 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '핸드메이드 특화, 약 20%',
  },
];

export const PLATFORM_MAP = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p])
) as Record<string, PlatformConfig>;

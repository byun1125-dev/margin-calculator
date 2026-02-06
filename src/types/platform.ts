export type PlatformId =
  | 'coupang'
  | 'naver-smartstore'
  | 'kakao-gift'
  | 'own-mall'
  | 'musinsa'
  | '29cm'
  | 'wconcept'
  | 'ably'
  | 'zigzag'
  | 'ohouse'
  | 'idus'
  | string; // 커스텀 플랫폼 지원

export interface FeeRange {
  min: number;
  max: number;
  default: number;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  color: string;
  salesCommission: FeeRange;
  paymentFee: FeeRange;
  description: string;
  isCustom?: boolean; // 커스텀 플랫폼 여부
}

export interface PlatformDiscount {
  enabled: boolean;
  percentOff: number; // 할인율 (%)
  amountOff: number; // 할인 금액 (원)
}

export interface PlatformUserConfig {
  salesCommissionRate: number;
  paymentFeeRate: number;
  color?: string; // 사용자 정의 컬러
  discount?: PlatformDiscount;
}

export interface PlatformFeeBreakdown {
  salesCommission: number;
  paymentFee: number;
  totalFees: number;
  effectiveFeeRate: number;
}

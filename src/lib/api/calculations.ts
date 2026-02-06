import { CostBreakdown } from '@/types/product';
import { PlatformId, PlatformUserConfig } from '@/types/platform';
import { MarginCalculationResult, BreakevenResult, FixedCostItem } from '@/types/calculation';
import type {
  ReverseCalculationMode,
  MarginCalculateResponse,
  ReverseCalculateResponse,
  SimulationBatchResponse,
  BreakevenCalculateResponse,
} from '@/types/api';

// --- 공통 fetch 래퍼 ---

async function fetchApi<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || '서버 오류가 발생했습니다.');
  }

  return response.json();
}

// --- 마진 계산 API ---

export async function calculateAllPlatformsApi(
  sellingPrice: number,
  costs: CostBreakdown,
  activePlatforms: PlatformId[],
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>
): Promise<MarginCalculationResult[]> {
  const data = await fetchApi<MarginCalculateResponse>('/api/calculate/margin', {
    sellingPrice,
    costs,
    activePlatforms,
    platformConfigs,
  });
  return data.results;
}

// --- 역산 계산 API ---

export async function calculateRequiredPriceAllPlatformsApi(
  mode: ReverseCalculationMode,
  targetValue: number,
  costs: CostBreakdown,
  activePlatforms: PlatformId[],
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>
): Promise<Record<string, number>> {
  const data = await fetchApi<ReverseCalculateResponse>('/api/calculate/reverse', {
    mode,
    targetValue,
    costs,
    activePlatforms,
    platformConfigs,
  });
  return data.requiredPrices;
}

// --- 할인 시뮬레이션 API (배치) ---

export async function simulateDiscountBatchApi(params: {
  sellingPrice: number;
  costs: CostBreakdown;
  discountPercent: number;
  activePlatforms: PlatformId[];
  platformConfigs: Partial<Record<PlatformId, Partial<PlatformUserConfig>>>;
  curveConfig?: {
    platformId: PlatformId;
    maxDiscount?: number;
    step?: number;
  };
}): Promise<SimulationBatchResponse> {
  return fetchApi<SimulationBatchResponse>('/api/calculate/simulation', params);
}

// --- 손익분기 API ---

export async function calculateBreakevenApi(
  marginResult: MarginCalculationResult,
  fixedCosts: FixedCostItem[]
): Promise<BreakevenResult> {
  const data = await fetchApi<BreakevenCalculateResponse>('/api/calculate/breakeven', {
    marginResult,
    fixedCosts,
  });
  return data.result;
}

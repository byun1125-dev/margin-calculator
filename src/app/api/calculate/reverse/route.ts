import { NextRequest, NextResponse } from 'next/server';
import { calculateRequiredPriceAllPlatforms } from '@/lib/calculations/reverseCalculator';
import { PlatformId, PlatformUserConfig } from '@/types/platform';
import type { ReverseCalculationMode } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { mode, targetValue, costs, activePlatforms, platformConfigs } = body;

    if (!mode || targetValue == null || !costs || !activePlatforms) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const requiredPrices = calculateRequiredPriceAllPlatforms(
      mode as ReverseCalculationMode,
      targetValue as number,
      costs,
      activePlatforms as PlatformId[],
      (platformConfigs ?? {}) as Partial<Record<PlatformId, Partial<PlatformUserConfig>>>
    );

    return NextResponse.json({ requiredPrices });
  } catch (error) {
    console.error('Reverse calculation error:', error);
    return NextResponse.json(
      { error: '역산 계산 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

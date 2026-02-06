import { NextRequest, NextResponse } from 'next/server';
import { calculateAllPlatforms } from '@/lib/calculations/marginCalculator';
import { PlatformId, PlatformUserConfig } from '@/types/platform';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { sellingPrice, costs, activePlatforms, platformConfigs } = body;

    if (!sellingPrice || !costs || !activePlatforms) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const results = calculateAllPlatforms(
      sellingPrice as number,
      costs,
      activePlatforms as PlatformId[],
      (platformConfigs ?? {}) as Partial<Record<PlatformId, Partial<PlatformUserConfig>>>
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Margin calculation error:', error);
    return NextResponse.json(
      { error: '계산 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

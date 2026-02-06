import { NextRequest, NextResponse } from 'next/server';
import { simulateDiscount, generateDiscountCurve } from '@/lib/calculations/discountSimulator';
import { PlatformId, PlatformUserConfig } from '@/types/platform';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { sellingPrice, costs, discountPercent, activePlatforms, platformConfigs, curveConfig } = body;

    if (!sellingPrice || !costs || discountPercent == null || !activePlatforms) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 모든 활성 플랫폼에 대한 할인 시뮬레이션
    const simulationResults = (activePlatforms as PlatformId[]).map((platformId) => ({
      platformId,
      result: simulateDiscount(
        platformId,
        sellingPrice as number,
        costs,
        discountPercent as number,
        ((platformConfigs ?? {}) as Record<string, Partial<PlatformUserConfig>>)[platformId]
      ),
    }));

    // 선택적으로 할인 곡선 데이터 생성
    let curveData: Array<{ discount: number; netProfit: number; marginPercent: number }> | undefined;
    if (curveConfig) {
      curveData = generateDiscountCurve(
        curveConfig.platformId as PlatformId,
        sellingPrice as number,
        costs,
        ((platformConfigs ?? {}) as Record<string, Partial<PlatformUserConfig>>)[curveConfig.platformId],
        curveConfig.maxDiscount ?? 50,
        curveConfig.step ?? 5
      );
    }

    return NextResponse.json({ simulationResults, curveData });
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: '시뮬레이션 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { calculateBreakeven } from '@/lib/calculations/breakevenCalculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { marginResult, fixedCosts } = body;

    if (!marginResult || !fixedCosts) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const result = calculateBreakeven(marginResult, fixedCosts);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Breakeven calculation error:', error);
    return NextResponse.json(
      { error: '손익분기 계산 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

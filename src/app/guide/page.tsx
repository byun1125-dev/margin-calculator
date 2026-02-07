'use client';

import { Card } from '@/components/ui/Card';
import { 
  BookOpen, 
  Calculator, 
  Package, 
  Settings, 
  TrendingUp, 
  Layers,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={24} className="text-gray-900" />
          사용 가이드
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          마진 계산기의 모든 기능을 쉽게 이해하고 활용해보세요
        </p>
      </div>

      {/* 시작하기 */}
      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200 uppercase">
          시작하기
        </h2>
        
        <Card className="mb-3">
          <h3 className="text-sm font-bold text-gray-900 mb-2">로그인이 필요한가요?</h3>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <CheckCircle size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <div>
                <strong>로그인 없이 사용 가능한 기능:</strong>
                <p className="text-gray-600 mt-0.5">모든 계산 기능 (워크스페이스, 손익분기점, 플랫폼 관리) - 브라우저에 저장됩니다</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <div>
                <strong>로그인이 필요한 기능:</strong>
                <p className="text-gray-600 mt-0.5">상품 저장 및 관리 - 여러 기기에서 동기화됩니다</p>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link href="/login" className="text-xs text-gray-900 hover:text-gray-600">
              로그인 하러 가기 →
            </Link>
          </div>
        </Card>
      </section>

      {/* 주요 기능 */}
      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200 uppercase">
          주요 기능
        </h2>

        <div className="space-y-3">
          {/* 워크스페이스 */}
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-100">
                <Layers size={16} className="text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">통합 워크스페이스</h3>
                <p className="text-xs text-gray-500 mt-0.5">모든 계산 기능을 한 화면에서</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <strong className="text-gray-900">1. 원가 입력</strong>
                <p className="text-gray-600 mt-0.5">제조원가, 배송비, 기타 비용을 입력하세요.</p>
              </div>
              <div>
                <strong className="text-gray-900">2. 판매가 입력</strong>
                <p className="text-gray-600 mt-0.5">실제 판매하려는 가격을 입력하세요.</p>
              </div>
              <div>
                <strong className="text-gray-900">3. 플랫폼 선택</strong>
                <p className="text-gray-600 mt-0.5">판매할 플랫폼을 체크하세요 (여러 개 선택 가능).</p>
              </div>
              <div>
                <strong className="text-gray-900">4. 결과 확인</strong>
                <p className="text-gray-600 mt-0.5">플랫폼별 마진, 비교, 가격 역산 결과를 탭에서 확인하세요.</p>
              </div>
            </div>

            <div className="mt-3 p-2 bg-gray-50 border-l-2 border-gray-900 text-xs">
              <strong>Tip:</strong> 할인 적용 체크박스로 플랫폼별로 다른 할인율을 바로 적용할 수 있습니다!
            </div>
          </Card>

          {/* 가격 역산 */}
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-100">
                <Calculator size={16} className="text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">가격 역산</h3>
                <p className="text-xs text-gray-500 mt-0.5">목표 이익을 위한 필요 판매가 계산</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <strong className="text-gray-900">목표 금액 방식</strong>
                <p className="text-gray-600 mt-0.5">예: "1만원을 남기려면 얼마에 팔아야 할까?" → 필요 판매가 계산</p>
              </div>
              <div>
                <strong className="text-gray-900">목표 마진율 방식</strong>
                <p className="text-gray-600 mt-0.5">예: "60% 마진을 남기려면 얼마에 팔아야 할까?" → 필요 판매가 계산</p>
              </div>
            </div>

            <div className="mt-3 p-2 bg-gray-50 border-l-2 border-gray-900 text-xs">
              <strong>Tip:</strong> 플랫폼별로 수수료가 다르니 가장 낮은 가격을 찾아보세요!
            </div>
          </Card>

          {/* 손익분기점 */}
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-100">
                <TrendingUp size={16} className="text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">목표 이익 시뮬레이터</h3>
                <p className="text-xs text-gray-500 mt-0.5">이번 달 목표를 위한 판매 계획</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <strong className="text-gray-900">1. 목표 설정</strong>
                <p className="text-gray-600 mt-0.5">월 고정비 (임대료, 인건비 등)와 목표 순수익을 입력하세요.</p>
              </div>
              <div>
                <strong className="text-gray-900">2. 제품별 수량 조절</strong>
                <p className="text-gray-600 mt-0.5">슬라이더로 각 제품을 몇 개 팔지 설정하세요.</p>
              </div>
              <div>
                <strong className="text-gray-900">3. 실시간 목표 확인</strong>
                <p className="text-gray-600 mt-0.5">현재 설정으로 목표 달성까지 얼마나 남았는지 확인하세요.</p>
              </div>
            </div>

            <div className="mt-3 p-2 bg-gray-50 border-l-2 border-gray-900 text-xs">
              <strong>참고:</strong> 이 기능을 사용하려면 먼저 상품을 등록해야 합니다!
            </div>
          </Card>

          {/* 상품 관리 */}
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-100">
                <Package size={16} className="text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">상품 관리</h3>
                <p className="text-xs text-gray-500 mt-0.5">상품 정보를 저장하고 관리 (로그인 필요)</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <strong className="text-gray-900">상품 등록</strong>
                <p className="text-gray-600 mt-0.5">상품명, 원가 정보, 플랫폼별 판매가를 입력하고 저장하세요.</p>
              </div>
              <div>
                <strong className="text-gray-900">플랫폼별 판매가</strong>
                <p className="text-gray-600 mt-0.5">하나의 상품을 여러 플랫폼에서 다른 가격으로 판매할 수 있습니다.</p>
              </div>
              <div>
                <strong className="text-gray-900">수정/삭제</strong>
                <p className="text-gray-600 mt-0.5">저장된 상품은 언제든지 수정하거나 삭제할 수 있습니다.</p>
              </div>
            </div>

            <div className="mt-3 p-2 bg-gray-50 border-l-2 border-gray-900 text-xs">
              <strong>중요:</strong> 로그인하면 여러 기기에서 동일한 상품 데이터를 사용할 수 있습니다!
            </div>
          </Card>

          {/* 플랫폼 관리 */}
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-100">
                <Settings size={16} className="text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">플랫폼 관리</h3>
                <p className="text-xs text-gray-500 mt-0.5">플랫폼 수수료 및 컬러 설정</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <strong className="text-gray-900">기본 플랫폼</strong>
                <p className="text-gray-600 mt-0.5">쿠팡, 스마트스토어 등 주요 플랫폼이 기본 제공됩니다.</p>
              </div>
              <div>
                <strong className="text-gray-900">수수료 커스터마이징</strong>
                <p className="text-gray-600 mt-0.5">"설정" 버튼으로 내 상품 카테고리의 실제 수수료를 입력하세요.</p>
              </div>
              <div>
                <strong className="text-gray-900">커스텀 플랫폼 추가</strong>
                <p className="text-gray-600 mt-0.5">자체 쇼핑몰이나 기타 플랫폼을 직접 추가할 수 있습니다.</p>
              </div>
              <div>
                <strong className="text-gray-900">컬러 변경</strong>
                <p className="text-gray-600 mt-0.5">플랫폼별로 원하는 컬러로 변경하여 쉽게 구분하세요.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200 uppercase">
          자주 묻는 질문
        </h2>

        <div className="space-y-3">
          <Card>
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900">마진율은 어떻게 계산되나요?</h3>
            </div>
            <p className="text-xs text-gray-600 pl-5">
              <strong>마진율 = (순수익 / 판매가) × 100</strong><br/>
              순수익 = 판매가 - 원가 - 판매 수수료 - 결제 수수료
            </p>
          </Card>

          <Card>
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900">적정 마진율은 몇 %인가요?</h3>
            </div>
            <p className="text-xs text-gray-600 pl-5">
              업종마다 다르지만, 제조 브랜드는 보통 <strong>50-70% 이상</strong>을 목표로 합니다.
              고정비(임대료, 인건비, 마케팅 등)를 고려하면 순수익으로 최소 40% 이상은 남겨야 안정적입니다.
            </p>
          </Card>

          <Card>
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900">데이터는 어디에 저장되나요?</h3>
            </div>
            <p className="text-xs text-gray-600 pl-5">
              <strong>로그인 안 함:</strong> 브라우저 로컬 스토리지에 저장 (기기별 저장)<br/>
              <strong>로그인 함:</strong> Firebase 클라우드에 저장 (모든 기기에서 동기화)
            </p>
          </Card>

          <Card>
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900">계산이 정확한가요?</h3>
            </div>
            <p className="text-xs text-gray-600 pl-5">
              각 플랫폼의 기본 수수료율을 적용하여 계산합니다. 
              실제 수수료는 카테고리, 판매액, 프로모션 등에 따라 다를 수 있으니,
              "플랫폼 관리"에서 실제 수수료를 입력하여 정확도를 높이세요.
            </p>
          </Card>
        </div>
      </section>

      {/* 빠른 시작 */}
      <section className="bg-gray-50 border border-gray-200 p-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">지금 바로 시작하기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <Link
            href="/workspace"
            className="p-3 bg-white border border-gray-300 hover:border-gray-900 transition-colors text-center"
          >
            <strong className="text-gray-900">계산해보기</strong>
            <p className="text-gray-600 mt-1">워크스페이스로 이동</p>
          </Link>
          <Link
            href="/products"
            className="p-3 bg-white border border-gray-300 hover:border-gray-900 transition-colors text-center"
          >
            <strong className="text-gray-900">상품 등록하기</strong>
            <p className="text-gray-600 mt-1">상품 관리로 이동</p>
          </Link>
          <Link
            href="/login"
            className="p-3 bg-white border border-gray-300 hover:border-gray-900 transition-colors text-center"
          >
            <strong className="text-gray-900">로그인하기</strong>
            <p className="text-gray-600 mt-1">데이터 동기화</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

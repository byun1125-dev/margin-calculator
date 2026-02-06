'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CalculatorPage() {
  const router = useRouter();

  useEffect(() => {
    // 3초 후 자동 리다이렉트
    const timer = setTimeout(() => {
      router.push('/workspace');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <ArrowRight className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">워크스페이스로 이동</h2>
          <p className="text-gray-500">
            마진 계산 기능이 <strong>통합 워크스페이스</strong>로 이동되었습니다
          </p>
        </div>
        <button
          onClick={() => router.push('/workspace')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          워크스페이스로 이동
          <ArrowRight size={18} />
        </button>
        <p className="text-xs text-gray-400 mt-4">3초 후 자동으로 이동합니다...</p>
      </div>
    </div>
  );
}

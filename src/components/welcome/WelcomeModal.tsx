'use client';

import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import Link from 'next/link';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full border border-gray-200">
        <div className="border-b border-gray-200 p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">마진 계산기에 오신 것을 환영합니다!</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">빠른 시작</h3>
            <p className="text-xs text-gray-600">
              스몰 브랜드를 위한 마진 계산기입니다. 
              플랫폼별 수수료, 마진율, 손익분기점을 쉽고 빠르게 계산해보세요.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-gray-50">
              <Check size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-xs text-gray-900">로그인 없이 사용 가능</strong>
                <p className="text-xs text-gray-600 mt-0.5">
                  모든 계산 기능을 바로 사용할 수 있습니다
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-gray-50">
              <Check size={14} className="text-gray-900 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-xs text-gray-900">상품 저장은 로그인 필요</strong>
                <p className="text-xs text-gray-600 mt-0.5">
                  로그인하면 상품을 저장하고 여러 기기에서 동기화할 수 있습니다
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 border-l-2 border-gray-900 bg-gray-50 text-xs">
            <strong className="text-gray-900">Tip:</strong> 처음 사용하신다면 
            <Link href="/guide" className="text-gray-900 underline mx-1" onClick={handleClose}>
              가이드 페이지
            </Link>
            에서 사용법을 확인해보세요!
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 border-gray-300 accent-gray-900"
            />
            <label htmlFor="dontShowAgain" className="text-xs text-gray-600 cursor-pointer">
              다시 보지 않기
            </label>
          </div>

          <div className="flex gap-2">
            <Link
              href="/login"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              로그인
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

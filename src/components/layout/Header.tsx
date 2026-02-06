'use client';

import Link from 'next/link';
import { Calculator } from 'lucide-react';

export function Header() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Calculator size={22} className="text-indigo-600" />
          <span className="text-lg font-bold text-gray-900">마진 계산기</span>
        </Link>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  BarChart3,
  Percent,
  TrendingUp,
  Package,
  LayoutDashboard,
  Layers,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/workspace', label: '워크스페이스', icon: Layers, highlight: true },
  { href: '/breakeven', label: '손익분기점', icon: TrendingUp },
  { href: '/products', label: '상품 관리', icon: Package },
  { href: '/platforms', label: '플랫폼 관리', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">마진 계산기</h1>
        <p className="text-xs text-gray-500 mt-1">스몰 브랜드를 위한 수익 분석</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
                ${item.highlight && !isActive ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50' : ''}
              `}
            >
              <Icon size={18} />
              {item.label}
              {item.highlight && !isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                  NEW
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

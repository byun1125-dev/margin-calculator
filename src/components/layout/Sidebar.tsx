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
  BookOpen,
  LogIn,
  User,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { logout } from '@/lib/auth';
import { useState } from 'react';

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/workspace', label: '워크스페이스', icon: Layers, highlight: true },
  { href: '/breakeven', label: '손익분기점', icon: TrendingUp },
  { href: '/products', label: '상품 관리', icon: Package },
  { href: '/platforms', label: '플랫폼 관리', icon: Settings },
  { href: '/guide', label: '가이드', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">마진 계산기</h1>
        <p className="text-xs text-gray-500 mt-0.5">스몰 브랜드를 위한 수익 분석</p>
      </div>
      <nav className="flex-1 p-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors relative border-l-2
                ${isActive
                  ? 'border-gray-900 bg-gray-50 text-gray-900'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon size={16} />
              {item.label}
              {item.highlight && !isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-900 border border-gray-900 px-1 py-0.5">
                  NEW
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={14} />
              <span className="flex-1 text-left truncate">
                {user.displayName || user.email}
              </span>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={14} />
                    로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            <LogIn size={14} />
            로그인
          </Link>
        )}
      </div>
    </aside>
  );
}

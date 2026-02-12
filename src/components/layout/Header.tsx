'use client';

import Link from 'next/link';
import { LogIn, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { logout } from '@/lib/auth';
import { useState } from 'react';

export function Header() {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">마진 계산기</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={14} />
                <span className="hidden sm:inline">{user.displayName || user.email}</span>
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 z-20">
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              <LogIn size={14} />
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

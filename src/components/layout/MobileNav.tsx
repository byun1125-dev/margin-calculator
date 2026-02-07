'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Package,
  Settings,
  BookOpen,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '홈', icon: LayoutDashboard },
  { href: '/workspace', label: '워크스페이스', icon: Layers },
  { href: '/products', label: '상품', icon: Package },
  { href: '/guide', label: '가이드', icon: BookOpen },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors
                ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

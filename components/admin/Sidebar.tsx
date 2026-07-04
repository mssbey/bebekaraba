'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, LogOut, ExternalLink, PanelLeftClose } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { NAV } from '@/lib/admin-nav';
import { useAdmin } from './AdminProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useAdmin();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const width = collapsed ? 76 : 264;

  const content = (
    <div className="flex flex-col h-full ad-mesh">
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 h-16 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-white/95 flex items-center justify-center flex-shrink-0 overflow-hidden shadow">
          <Image src="/2.png" alt="Bebek Arabacınız" width={28} height={28} className="object-contain" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">Bebek Arabacınız</p>
            <p className="text-[10px] text-white/45 leading-tight">Yönetim Paneli</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {NAV.map(group => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/35">{group.title}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`ad-sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 ${active ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && !item.real && (
                      <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/10 text-white/50">yakında</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-white/10 p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className={`ad-sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 ${collapsed ? 'justify-center' : ''}`}
        >
          <ExternalLink size={17} className="flex-shrink-0" />
          {!collapsed && <span>Siteyi Gör</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={`ad-sidebar-link w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:!bg-red-500/15 hover:text-red-300 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={toggleCollapsed}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white text-navy-800 shadow-md items-center justify-center border border-black/5 hover:scale-110 transition-transform"
        aria-label="Kenar çubuğunu daralt"
      >
        <ChevronLeft size={14} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="ad-sidebar relative hidden lg:block flex-shrink-0 h-screen sticky top-0 z-40"
        style={{ width }}
      >
        {content}
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="ad-sidebar fixed left-0 top-0 bottom-0 z-50 w-[264px] lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 text-white/60 hover:text-white"
              >
                <PanelLeftClose size={20} />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

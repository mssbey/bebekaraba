'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Sun, Moon, Menu, Command, Package, ShoppingBag, Settings } from 'lucide-react';
import { ALL_ITEMS } from '@/lib/admin-nav';
import { useAdmin } from './AdminProvider';

const NOTIFS = [
  { icon: ShoppingBag, color: '#EF742C', title: 'Yeni sipariş bekliyor', time: '2 dk önce' },
  { icon: Package, color: '#EF4444', title: 'Stok azaldı: Cybex Aton G', time: '1 saat önce' },
  { icon: Settings, color: '#3B82F6', title: 'Yedekleme tamamlandı', time: 'Dün' },
];

export default function Topbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, setMobileOpen, setPaletteOpen } = useAdmin();
  const [notifOpen, setNotifOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const current = ALL_ITEMS.find(i =>
    i.href === '/admin' ? pathname === '/admin' : pathname.startsWith(i.href)
  );
  const title = current?.label ?? 'Panel';

  return (
    <header className="ad-glass sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 border-b ad-border-c">
      {/* mobile menu */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden ad-muted hover:opacity-70">
        <Menu size={22} />
      </button>

      {/* breadcrumb / title */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] ad-muted">
          <span>Admin</span><span>/</span><span className="truncate">{title}</span>
        </div>
        <h1 className="text-base sm:text-lg font-bold leading-tight truncate" style={{ color: 'var(--ad-text)' }}>{title}</h1>
      </div>

      {/* search */}
      <button
        onClick={() => setPaletteOpen(true)}
        className="ad-surface-2 hidden md:flex items-center gap-2 ml-auto rounded-xl border ad-border-c px-3 py-2 text-sm ad-muted hover:border-brand-400 transition-colors w-64"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Ara veya komut...</span>
        <kbd className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
          <Command size={10} /> K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
        <button onClick={() => setPaletteOpen(true)} className="md:hidden w-9 h-9 rounded-xl ad-surface-2 border ad-border-c flex items-center justify-center ad-muted">
          <Search size={17} />
        </button>

        {/* Quick add */}
        <div className="relative">
          <button
            onClick={() => { setAddOpen(v => !v); setNotifOpen(false); }}
            className="ad-btn-accent h-9 px-3 rounded-xl flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Hızlı Ekle</span>
          </button>
          <AnimatePresence>
            {addOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setAddOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-52 ad-surface rounded-2xl shadow-xl border ad-border-c p-1.5 z-30"
                >
                  {[
                    { icon: Package, label: 'Yeni Ürün', href: '/admin/urunler?new=1' },
                    { icon: ShoppingBag, label: 'Siparişlere Git', href: '/admin/siparisler' },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link key={label} href={href} onClick={() => setAddOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--ad-text)' }}>
                      <Icon size={16} className="ad-muted" /> {label}
                    </Link>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setAddOpen(false); }}
            className="relative w-9 h-9 rounded-xl ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500 transition-colors"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2" style={{ ['--tw-ring-color' as string]: 'var(--ad-surface)' }} />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] ad-surface rounded-2xl shadow-xl border ad-border-c overflow-hidden z-30"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b ad-border-c">
                    <p className="font-semibold text-sm" style={{ color: 'var(--ad-text)' }}>Bildirimler</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-600">3 yeni</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFS.map((n, i) => {
                      const Icon = n.icon;
                      return (
                        <div key={i} className="flex gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${n.color}1A`, color: n.color }}>
                            <Icon size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm" style={{ color: 'var(--ad-text)' }}>{n.title}</p>
                            <p className="text-[11px] ad-muted">{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link href="/admin/mesajlar" onClick={() => setNotifOpen(false)} className="block text-center py-2.5 text-xs font-semibold text-brand-500 border-t ad-border-c hover:bg-black/5 dark:hover:bg-white/5">
                    Tümünü Gör
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme */}
        <button onClick={toggleTheme} className="w-9 h-9 rounded-xl ad-surface-2 border ad-border-c flex items-center justify-center ad-muted hover:text-brand-500 transition-colors" aria-label="Tema değiştir">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow">
          BA
        </div>
      </div>
    </header>
  );
}

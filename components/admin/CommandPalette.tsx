'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CornerDownLeft, Sun, Moon, LogOut, ExternalLink } from 'lucide-react';
import { ALL_ITEMS } from '@/lib/admin-nav';
import { useAdmin } from './AdminProvider';

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, toggleTheme } = useAdmin();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  type Cmd = { id: string; label: string; group: string; icon: React.ReactNode; run: () => void };

  const commands: Cmd[] = useMemo(() => {
    const nav: Cmd[] = ALL_ITEMS.map(i => ({
      id: i.href,
      label: i.label,
      group: 'Sayfalar',
      icon: <i.icon size={16} />,
      run: () => router.push(i.href),
    }));
    const actions: Cmd[] = [
      { id: 'theme', label: 'Temayı Değiştir (Açık/Koyu)', group: 'Eylemler', icon: <Sun size={16} />, run: toggleTheme },
      { id: 'site', label: 'Siteyi Yeni Sekmede Aç', group: 'Eylemler', icon: <ExternalLink size={16} />, run: () => window.open('/', '_blank') },
      { id: 'logout', label: 'Çıkış Yap', group: 'Eylemler', icon: <LogOut size={16} />, run: () => { window.location.href = '/api/admin/logout'; } },
    ];
    return [...nav, ...actions];
  }, [router, toggleTheme]);

  const filtered = useMemo(() => {
    if (!q.trim()) return commands;
    const s = q.toLowerCase();
    return commands.filter(c => c.label.toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => {
    if (paletteOpen) {
      setQ(''); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [paletteOpen]);

  useEffect(() => { setActive(0); }, [q]);

  const exec = (c?: Cmd) => {
    const cmd = c ?? filtered[active];
    if (!cmd) return;
    cmd.run();
    setPaletteOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); exec(); }
  };

  // group output preserving order
  const groups = useMemo(() => {
    const m = new Map<string, { cmd: Cmd; index: number }[]>();
    filtered.forEach((cmd, index) => {
      if (!m.has(cmd.group)) m.set(cmd.group, []);
      m.get(cmd.group)!.push({ cmd, index });
    });
    return [...m.entries()];
  }, [filtered]);

  return (
    <AnimatePresence>
      {paletteOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPaletteOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative w-full max-w-xl ad-surface rounded-2xl shadow-2xl border ad-border-c overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b ad-border-c">
              <Search size={18} className="ad-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Sayfa ara veya komut çalıştır..."
                className="flex-1 bg-transparent py-4 text-sm outline-none"
                style={{ color: 'var(--ad-text)' }}
              />
              <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 ad-muted">ESC</kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-sm ad-muted">Sonuç bulunamadı</p>
              ) : groups.map(([group, items]) => (
                <div key={group} className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ad-muted">{group}</p>
                  {items.map(({ cmd, index }) => (
                    <button
                      key={cmd.id}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => exec(cmd)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${index === active ? 'bg-brand-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                      style={index === active ? undefined : { color: 'var(--ad-text)' }}
                    >
                      <span className={index === active ? 'text-white' : 'ad-muted'}>{cmd.icon}</span>
                      <span className="flex-1 text-left">{cmd.label}</span>
                      {index === active && <CornerDownLeft size={14} />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

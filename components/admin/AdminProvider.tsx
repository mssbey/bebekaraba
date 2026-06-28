'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';
export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  desc?: string;
  action?: { label: string; onClick: () => void };
}

interface AdminCtx {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => number;
  dismiss: (id: number) => void;
}

const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAdmin must be used within AdminProvider');
  return c;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);

  // init prefs
  useEffect(() => {
    const t = (localStorage.getItem('ba_admin_theme') as 'light' | 'dark') || 'light';
    setTheme(t);
    setCollapsed(localStorage.getItem('ba_admin_collapsed') === '1');
  }, []);

  useEffect(() => {
    localStorage.setItem('ba_admin_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ba_admin_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  // Ctrl/Cmd+K command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = useCallback(() => setTheme(t => (t === 'light' ? 'dark' : 'light')), []);
  const toggleCollapsed = useCallback(() => setCollapsed(c => !c), []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = idRef.current++;
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => dismiss(id), 4200);
    return id;
  }, [dismiss]);

  return (
    <Ctx.Provider value={{
      theme, toggleTheme, collapsed, toggleCollapsed,
      mobileOpen, setMobileOpen, paletteOpen, setPaletteOpen,
      toasts, toast, dismiss,
    }}>
      {children}
    </Ctx.Provider>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAdmin, type ToastKind } from './AdminProvider';

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const ACCENT: Record<ToastKind, string> = {
  success: '#22C55E',
  error: '#EF4444',
  info: '#3B82F6',
  warning: '#F59E0B',
};

export default function ToastViewport() {
  const { toasts, dismiss } = useAdmin();

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-3 w-[340px] max-w-[calc(100vw-2.5rem)]">
      <AnimatePresence>
        {toasts.map(t => {
          const Icon = ICONS[t.kind];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="ad-glass rounded-2xl p-4 shadow-lg flex gap-3 items-start"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ACCENT[t.kind]}1A`, color: ACCENT[t.kind] }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--ad-text)' }}>{t.title}</p>
                {t.desc && <p className="text-xs ad-muted mt-0.5">{t.desc}</p>}
                {t.action && (
                  <button
                    onClick={() => { t.action!.onClick(); dismiss(t.id); }}
                    className="text-xs font-semibold mt-1.5"
                    style={{ color: 'var(--ad-accent)' }}
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button onClick={() => dismiss(t.id)} className="ad-muted hover:opacity-70 flex-shrink-0">
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

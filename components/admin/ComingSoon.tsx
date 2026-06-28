'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ALL_ITEMS } from '@/lib/admin-nav';

export default function ComingSoon({ slug }: { slug: string }) {
  const item = ALL_ITEMS.find(i => i.href === `/admin/${slug}`);
  const Icon = item?.icon ?? Sparkles;
  const label = item?.label ?? 'Bu Bölüm';

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        className="ad-card max-w-md w-full p-10 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/12 text-brand-500 flex items-center justify-center mb-5"
        >
          <Icon size={28} />
        </motion.div>
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 mb-3">Yakında</span>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--ad-text)' }}>{label}</h2>
        <p className="text-sm ad-muted mb-6">
          Bu modül için arayüz tasarlandı; veri altyapısı eklendiğinde tam işlevsel hale gelecek. Şu an Dashboard, Ürünler ve Siparişler tam çalışır durumda.
        </p>
        <Link href="/admin" className="ad-btn-accent inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
          <ArrowLeft size={15} /> Dashboard&apos;a Dön
        </Link>
      </motion.div>
    </div>
  );
}

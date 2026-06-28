'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

function MagneticButton({ inStock }: { inStock: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setPos({ x: x * 0.25, y: y * 0.35 });
  };

  return (
    <motion.div animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="inline-block">
      <Link
        ref={ref}
        href="/urunler"
        onMouseMove={handleMove}
        onMouseLeave={() => setPos({ x: 0, y: 0 })}
        className="group relative inline-flex items-center gap-3 font-bold text-white overflow-hidden"
        style={{ padding: '20px 40px', borderRadius: 999, background: 'linear-gradient(135deg, #EF742C 0%, #D4571F 100%)', boxShadow: '0 12px 48px rgba(239,116,44,0.5)' }}
      >
        {/* expanding light */}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.35), transparent 60%)' }} />
        <span className="relative flex items-center gap-3 text-base">
          Alışverişe Başla
          <ArrowRight size={19} className="group-hover:translate-x-1.5 transition-transform" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function CtaSection({ inStock }: { inStock: number }) {
  const particles = Array.from({ length: 14 });

  return (
    <section className="py-24 px-6 sm:px-8" style={{ background: '#FAF8F4' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease }}
        className="relative max-w-[1300px] mx-auto overflow-hidden"
        style={{ borderRadius: 44, background: 'linear-gradient(135deg, #0E2138 0%, #1E3556 55%, #29568A 100%)', padding: 'clamp(56px, 8vw, 110px) clamp(28px, 6vw, 90px)' }}
      >
        {/* Orange glow */}
        <div className="absolute -top-20 left-1/4 w-[420px] h-[420px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(239,116,44,0.45)' }} />
        <div className="absolute -bottom-32 -right-10 w-[380px] h-[380px] rounded-full blur-[130px] pointer-events-none" style={{ background: 'rgba(41,86,138,0.7)' }} />

        {/* Floating particles */}
        {particles.map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              background: i % 2 ? 'rgba(239,116,44,0.6)' : 'rgba(255,255,255,0.4)',
            }}
            animate={{ y: [0, -22, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}

        {/* Stroller silhouette behind */}
        <svg className="absolute right-0 bottom-0 h-[80%] opacity-[0.06] pointer-events-none" viewBox="0 0 320 280" fill="none">
          <circle cx="105" cy="230" r="30" stroke="white" strokeWidth="6"/>
          <circle cx="215" cy="230" r="30" stroke="white" strokeWidth="6"/>
          <path d="M72 90 L55 200 H270 L248 90 Z" stroke="white" strokeWidth="6" strokeLinejoin="round"/>
          <path d="M72 90 C72 90 80 38 160 38 C240 38 248 90 248 90" stroke="white" strokeWidth="6" strokeLinecap="round"/>
          <path d="M55 200 L30 246" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        </svg>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-[11px] font-bold uppercase tracking-[4px] mb-6" style={{ color: 'rgba(239,116,44,0.9)' }}
          >
            Premium İkinci El · {inStock} Ürün Stokta
          </motion.p>

          <h2 className="font-serif font-bold text-white leading-[1.02] mb-7" style={{ fontSize: 'clamp(40px, 6vw, 76px)' }}>
            Hayalinizdeki<br />arabayı bulun.
          </h2>

          <p className="text-lg mb-10 max-w-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Her ürün yalnızca 1 adet. Hızlı hareket edin — gözünüze kestirdiğiniz model bir daha gelmeyebilir.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-7">
            <MagneticButton inStock={inStock} />
            <div className="flex items-center gap-5">
              {[
                { icon: ShieldCheck, label: 'Güvenli Ödeme' },
                { icon: Truck, label: 'Hızlı Kargo' },
                { icon: RefreshCcw, label: '7 Gün İade' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={15} style={{ color: 'rgba(239,116,44,0.9)' }} />
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

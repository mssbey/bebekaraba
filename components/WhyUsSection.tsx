'use client';

import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Truck, ShieldCheck, BadgeCheck, Heart, Quote } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

function CountUp({ to, suffix = '', prefix = '', decimals = 0 }: { to: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const mv = useMotionValue(0);
  const [val, setVal] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 1.6,
      ease,
      onUpdate: (v) => setVal(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, to, mv, decimals]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

const STROLLER = (
  <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="105" cy="230" r="30" stroke="#1E3556" strokeWidth="5" fill="#EBF2EB"/>
    <circle cx="105" cy="230" r="12" fill="#D4E7D4" stroke="#1E3556" strokeWidth="3"/>
    <circle cx="215" cy="230" r="30" stroke="#1E3556" strokeWidth="5" fill="#EBF2EB"/>
    <circle cx="215" cy="230" r="12" fill="#D4E7D4" stroke="#1E3556" strokeWidth="3"/>
    <path d="M72 90 L55 200 H270 L248 90 Z" fill="#FCEFE6" stroke="#1E3556" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M72 90 C72 90 80 38 160 38 C240 38 248 90 248 90" stroke="#1E3556" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
    <rect x="110" y="50" width="100" height="50" rx="14" fill="white" stroke="#1E3556" strokeWidth="2.5" opacity="0.9"/>
    <path d="M122 75 Q160 60 198 75" stroke="#B3D3B3" strokeWidth="2" strokeLinecap="round"/>
    <path d="M105 90 Q160 110 215 90" stroke="#EF742C" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M55 200 L30 246" stroke="#1E3556" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="32" cy="245" r="3" fill="#EF742C"/>
    <circle cx="39" cy="248" r="3" fill="#EF742C"/>
  </svg>
);

interface Props {
  totalOrders: number;
}

export default function WhyUsSection({ totalOrders }: Props) {
  const metrics = [
    { icon: ShieldCheck, label: 'Müşteri Memnuniyeti', value: 98, suffix: '%', progress: 98, depth: 0, color: '#2E7D52' },
    { icon: BadgeCheck, label: 'Kontrol Edilmiş Ürün', value: 100, suffix: '%', progress: 100, depth: -28, color: '#EF742C' },
    { icon: Truck, label: 'Gün İçinde Teslimat', value: 3, prefix: '1–', progress: 90, depth: 18, color: '#1E3556' },
    { icon: Heart, label: 'Mutlu Aile', value: Math.max(totalOrders, 500), suffix: '+', progress: 85, depth: -10, color: '#C44A6E' },
  ];

  return (
    <section className="relative overflow-hidden py-32" style={{ background: 'linear-gradient(180deg, #FAF8F4 0%, #F3EEE6 100%)' }}>
      {/* Abstract curved lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.5]" preserveAspectRatio="none" viewBox="0 0 1400 800" fill="none">
        <path d="M-50 200 Q400 100 800 300 T1500 250" stroke="#E2D6C4" strokeWidth="1.5" fill="none"/>
        <path d="M-50 450 Q500 350 900 500 T1500 480" stroke="#E2D6C4" strokeWidth="1.5" fill="none"/>
      </svg>
      <div className="absolute top-10 right-10 w-[380px] h-[380px] rounded-full blur-[130px] pointer-events-none" style={{ background: 'rgba(255,208,184,0.45)' }} />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: storytelling ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="relative"
          >
            <p className="text-[11px] font-bold uppercase tracking-[4px] mb-5" style={{ color: '#EF742C' }}>Hikayemiz</p>
            <h2 className="font-serif font-bold leading-[1.04] mb-8" style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: '#1E3556' }}>
              Her bebek,<br />en iyisini<br />hak eder.
            </h2>

            <div className="relative pl-7 mb-10 max-w-md" style={{ borderLeft: '3px solid #EF742C' }}>
              <Quote size={28} className="absolute -left-1.5 -top-2 opacity-0" />
              <p className="font-serif italic text-xl leading-relaxed" style={{ color: '#4A4A5A' }}>
                &ldquo;Her ürünü, kendi çocuğumuza alır gibi seçiyoruz. Fiziksel kontrol, dürüst açıklama, gerçek fotoğraf.&rdquo;
              </p>
            </div>

            {/* Stroller illustration with floating badges */}
            <div className="relative max-w-sm">
              <motion.div
                className="w-full"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {STROLLER}
              </motion.div>

              <motion.div
                className="absolute top-4 -right-2 px-4 py-2.5 rounded-2xl flex items-center gap-2"
                style={{ background: 'white', boxShadow: '0 12px 40px rgba(30,53,86,0.12)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <BadgeCheck size={16} style={{ color: '#2E7D52' }} />
                <span className="text-xs font-semibold" style={{ color: '#1E3556' }}>Orijinal & Kontrollü</span>
              </motion.div>

              <motion.div
                className="absolute bottom-12 -left-4 px-4 py-2.5 rounded-2xl flex items-center gap-2"
                style={{ background: 'white', boxShadow: '0 12px 40px rgba(30,53,86,0.12)' }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Heart size={16} style={{ color: '#C44A6E' }} />
                <span className="text-xs font-semibold" style={{ color: '#1E3556' }}>Sevgiyle seçildi</span>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Right: floating metric cards ── */}
          <div className="grid grid-cols-2 gap-5">
            {metrics.map(({ icon: Icon, label, value, suffix, prefix, progress, depth, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: depth }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
                whileHover={{ y: depth - 8, transition: { duration: 0.3 } }}
                className="p-7 rounded-[28px]"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 20px 60px rgba(30,53,86,0.08)',
                }}
              >
                <div className="flex items-center justify-center rounded-2xl mb-5" style={{ width: 48, height: 48, background: `${color}14`, color }}>
                  <Icon size={22} />
                </div>
                <p className="font-serif font-bold leading-none mb-2" style={{ fontSize: 42, color: '#1E3556' }}>
                  <CountUp to={value} suffix={suffix} prefix={prefix} />
                </p>
                <p className="text-sm font-medium mb-4" style={{ color: '#8E8E8E' }}>{label}</p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#ECE8E2' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3 + i * 0.1, ease }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

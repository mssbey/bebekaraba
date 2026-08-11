'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Cat {
  slug: string;
  title: string;
  desc: string;
  count: number;
  image: string;
  emoji: string;
  glow: string;
  tint: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

function CatCard({ cat, large = false }: { cat: Cat; large?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease }}
      whileHover="hover"
      className="relative h-full"
    >
      <Link
        href={`/urunler?kategori=${cat.slug}`}
        className="group relative block h-full overflow-hidden"
        style={{ borderRadius: 36, minHeight: large ? 560 : 264 }}
      >
        {/* Image */}
        <motion.div
          className="absolute inset-0"
          variants={{ hover: { scale: 1.06 } }}
          transition={{ duration: 0.8, ease }}
        >
          <Image
            src={cat.image}
            alt={cat.title}
            fill
            sizes={large ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 100vw, 50vw'}
            className="object-cover"
          />
        </motion.div>

        {/* Tint + gradient */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cat.tint} 0%, rgba(30,53,86,0.15) 55%, transparent 100%)` }} />

        {/* Light sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          variants={{ hover: { x: ['-120%', '120%'] } }}
          transition={{ duration: 1, ease }}
          style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)' }}
        />

        {/* Soft glow blob */}
        <motion.div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
          variants={{ hover: { scale: 1.4, opacity: 0.6 } }}
          transition={{ duration: 0.8, ease }}
          style={{ background: cat.glow }}
        />

        {/* Floating icon */}
        <motion.div
          className="absolute top-6 left-6 flex items-center justify-center rounded-2xl"
          style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.3)' }}
          variants={{ hover: { rotate: 12, scale: 1.1 } }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="text-2xl" aria-hidden>{cat.emoji}</span>
        </motion.div>

        {/* Count pill */}
        <div className="absolute top-7 right-6">
          <span className="text-[11px] font-bold tracking-wide px-3.5 py-1.5 rounded-full text-white" style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.25)' }}>
            {cat.count} ürün
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 inset-x-0 p-7">
          <h3 className="font-serif font-bold text-white mb-1.5 leading-tight" style={{ fontSize: large ? 38 : 26 }}>
            {cat.title}
          </h3>
          <p className="text-white/75 text-sm mb-5 max-w-sm">{cat.desc}</p>
          <motion.span
            className="inline-flex items-center gap-2 font-semibold text-sm text-white"
            variants={{ hover: { gap: 12 } }}
          >
            <span className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: '#EF742C', boxShadow: '0 6px 22px rgba(239,116,44,0.5)' }}>
              <motion.span variants={{ hover: { x: 3, y: -3 } }} transition={{ duration: 0.4, ease }}>
                <ArrowUpRight size={17} />
              </motion.span>
            </span>
            Keşfet
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategorySection({ categories }: { categories: Cat[] }) {
  const [featured, ...rest] = categories;

  return (
    <section className="relative overflow-hidden py-28" style={{ background: '#FAF8F4' }}>
      {/* Background organic blobs */}
      <div className="absolute top-20 -left-40 w-[480px] h-[480px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(180,211,180,0.35)' }} />
      <div className="absolute bottom-0 -right-32 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(255,208,184,0.4)' }} />
      <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-orange-400/40 animate-float" />
      <div className="absolute top-32 right-1/4 w-2 h-2 rounded-full bg-navy-300/50 animate-float" style={{ animationDelay: '1s' }} />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 max-w-2xl"
        >
          <p className="text-[11px] font-bold uppercase tracking-[4px] mb-4" style={{ color: '#EF742C' }}>Koleksiyon</p>
          <h2 className="font-serif font-bold leading-[1.05]" style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', color: '#1E3556' }}>
            Bebeğiniz için<br />özenle seçilmiş dünyalar
          </h2>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Featured left */}
          <CatCard cat={featured} large />
          {/* Stacked right */}
          <div className="flex flex-col gap-5">
            {rest.map((c) => <CatCard key={c.slug} cat={c} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

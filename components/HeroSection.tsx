'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
  totalProducts: number;
  totalOrders: number;
  inStock: number;
}

export default function HeroSection({ totalProducts, totalOrders, inStock }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/banner.mp4"
      />

      {/* Gradient overlay — top-to-bottom, dark navy to transparent then dark at bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-navy-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-navy-900/20" />

      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22/%3E%3C/svg%3E')]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 pt-28 pb-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-medium text-white/90 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            Premium İkinci El
            <span className="w-px h-3.5 bg-white/30" />
            <span className="text-white/70">{inStock} Ürün Stokta</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
            Bebeğinizin{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange-400">İlk Yolculuğu</span>
              <svg className="absolute -bottom-1.5 left-0 w-full" height="8" viewBox="0 0 300 8" fill="none" aria-hidden="true" preserveAspectRatio="none">
                <path d="M0 6 Q75 1 150 5 Q225 9 300 4" stroke="#F4723A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
              </svg>
            </span>
            <br />
            için Premium{' '}
            <span className="text-white/90">Seçimler</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
            Stokke, Bugaboo ve daha fazla premium markada ikinci el bebek arabaları.
            Her ürün özenle seçilmiş ve kontrol edilmiştir.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href="/urunler"
              className="group inline-flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200 shadow-[0_8px_32px_rgba(244,114,58,0.45)] hover:shadow-[0_12px_40px_rgba(244,114,58,0.55)] hover:-translate-y-0.5"
            >
              Ürünleri Keşfet
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/urunler?kategori=bebek-arabasi"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200"
            >
              Bebek Arabaları
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8">
            {[
              { value: `${totalProducts}+`, label: 'Ürün' },
              { value: `${totalOrders}+`, label: 'Mutlu Müşteri' },
              { value: '5.0★', label: 'Ortalama Puan' },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-8 bg-white/20" />}
                <div>
                  <p className="font-serif font-bold text-2xl text-white">{value}</p>
                  <p className="text-xs text-white/45 font-medium tracking-wide">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card — top right */}
      <div className="absolute top-1/3 right-10 hidden lg:block z-10 animate-float">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <CheckCircle2 size={17} className="text-green-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Stok Garantili</p>
              <p className="text-[10px] text-white/50">Her ürün 1 adet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card — bottom right */}
      <div className="absolute bottom-28 right-10 hidden lg:block z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <p className="text-xs font-semibold text-white/80">Premium Kontrol Edilmiş Ürünler</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-40">
        <span className="text-white text-[10px] font-medium tracking-widest uppercase">Keşfet</span>
        <ChevronDown size={16} className="text-white animate-bounce" />
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-hidden="true">
          <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  MessageCircle, Mail, MapPin, Instagram, ArrowUpRight,
  ShieldCheck, Truck, RefreshCcw, CreditCard, Send, Headphones,
} from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const TRUST = [
  { icon: ShieldCheck, label: 'Güvenli Ödeme', sub: 'SSL korumalı' },
  { icon: Truck, label: 'Hızlı Kargo', sub: '1–3 gün teslimat' },
  { icon: RefreshCcw, label: 'Kolay İade', sub: '7 gün içinde' },
  { icon: CreditCard, label: 'Taksit İmkânı', sub: 'Tüm kartlara' },
];

function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
      className="relative flex items-center gap-2 p-1.5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={sent ? 'Teşekkürler! 🎉' : 'E-posta adresiniz'}
        disabled={sent}
        className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none disabled:text-orange-300"
      />
      <button
        type="submit"
        aria-label="Abone ol"
        className="flex items-center justify-center rounded-xl text-white transition-transform hover:scale-105 active:scale-95"
        style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #EF742C, #D4571F)', boxShadow: '0 6px 22px rgba(239,116,44,0.45)' }}
      >
        <Send size={16} />
      </button>
    </form>
  );
}

export default function Footer() {
  const insta = Array.from({ length: 6 });

  return (
    <footer className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(180deg, #14283F 0%, #0E1D30 100%)' }}>
      {/* Curved top divider */}
      <div className="absolute top-0 inset-x-0 -translate-y-px leading-[0] pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[60px]" fill="#FAF8F4">
          <path d="M0 80 C 360 0 1080 0 1440 80 L 1440 0 L 0 0 Z" />
        </svg>
      </div>

      {/* Orange light blobs + noise */}
      <div className="absolute top-32 -left-24 w-[420px] h-[420px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'rgba(239,116,44,0.22)' }} />
      <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(41,86,138,0.5)' }} />

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 pt-28 pb-10">

        {/* ── Trust strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-16 mb-16 border-b border-white/10">
          {TRUST.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="flex items-center gap-3.5"
            >
              <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 46, height: 46, background: 'rgba(239,116,44,0.14)', border: '1px solid rgba(239,116,44,0.25)' }}>
                <Icon size={20} style={{ color: '#EF742C' }} />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-white/45">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">

          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3.5 mb-6 group w-fit">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border border-white/15">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-2" />
              </div>
              <div>
                <p className="font-serif font-bold text-2xl group-hover:text-orange-300 transition-colors">Bebek Arabacınız</p>
                <p className="text-[11px] text-white/45 tracking-[3px] uppercase">Premium İkinci El</p>
              </div>
            </Link>

            <p className="font-serif italic text-xl leading-relaxed text-white/70 mb-8 max-w-md">
              &ldquo;Her bebek, en iyisini hak eder.&rdquo;
            </p>

            <p className="text-[11px] font-bold uppercase tracking-[3px] text-white/40 mb-3">Bültene Katılın</p>
            <div className="max-w-md mb-8">
              <Newsletter />
            </div>

            <div className="flex gap-3">
              {[
                { href: 'https://www.shopier.com/BebekArabaciniz', label: 'Shopier', text: 'S' },
                { href: '#', label: 'Instagram', icon: Instagram },
              ].map(({ href, label, text, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/65 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all text-sm font-bold"
                >
                  {Icon ? <Icon size={16} /> : text}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[3px] text-white/40 mb-5">Kategoriler</h4>
            <ul className="space-y-3">
              {[
                { href: '/urunler?kategori=bebek-arabasi', label: 'Bebek Arabaları' },
                { href: '/urunler?kategori=oto-koltugu', label: 'Oto Koltukları' },
                { href: '/urunler?kategori=aksesuar', label: 'Aksesuarlar' },
                { href: '/urunler', label: 'Tüm Ürünler' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-[11px] font-bold uppercase tracking-[3px] text-white/40 mt-8 mb-5">Bilgi</h4>
            <ul className="space-y-3">
              {[
                { href: '/blog', label: 'Blog' },
                { href: '#', label: 'Nasıl Çalışır?' },
                { href: '#', label: 'İade Politikası' },
                { href: '/admin', label: 'Admin Paneli' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram gallery */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[3px] text-white/40 mb-5">@bebekarabaciniz</h4>
            <div className="grid grid-cols-3 gap-2">
              {insta.map((_, i) => (
                <a
                  key={i}
                  href="#"
                  className="group relative aspect-square rounded-xl overflow-hidden"
                  aria-label="Instagram gönderisi"
                >
                  <img src={`/products/${i + 1}.jpeg`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Instagram size={16} className="text-white" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Support card */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(14px)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-2xl" style={{ width: 44, height: 44, background: 'rgba(239,116,44,0.16)' }}>
                  <Headphones size={20} style={{ color: '#EF742C' }} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Yardıma mı ihtiyacınız var?</p>
                  <p className="text-xs text-white/45">7/24 destek ekibimiz hazır</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <MessageCircle size={15} className="text-green-400 flex-shrink-0" />
                  <span className="text-sm text-white/70">WhatsApp ile mesaj gönderin</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={15} className="text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-white/70">admin@bebekarabaciniz.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={15} className="text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-white/70">Türkiye geneli teslimat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© 2026 Bebek Arabacınız. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-2.5">
            {['VISA', 'MC', 'TROY', 'AMEX'].map((p) => (
              <span key={p} className="text-[10px] font-bold tracking-wide px-2.5 py-1.5 rounded-lg text-white/55" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            SSL ile korunmakta
          </div>
        </div>
      </div>
    </footer>
  );
}

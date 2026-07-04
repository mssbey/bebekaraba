'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Check, ArrowLeft, Package, Heart, BarChart2, Share2,
  ShieldCheck, Truck, RefreshCcw, Zap, CreditCard, Star, ChevronRight,
  BadgeCheck, Clock, ArrowRight, Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import { useFavorites } from '@/components/FavoritesProvider';

interface Product {
  id: string; name: string; slug: string; price: number; originalPrice?: number;
  stock: number; featured?: boolean; category: string; description: string; image?: string;
}

function formatPrice(p: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(p);
}

function getCategoryLabel(c: string) {
  if (c === 'oto-koltugu') return 'Oto Koltuğu';
  if (c === 'aksesuar') return 'Aksesuar';
  return 'Bebek Arabası';
}

const STROLLER_SVG = (
  <svg viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="88" cy="196" r="28" stroke="#163356" strokeWidth="3.5" fill="#F5F1EA"/>
    <circle cx="88" cy="196" r="11" fill="#ECE8E2" stroke="#163356" strokeWidth="2.5"/>
    <circle cx="192" cy="196" r="28" stroke="#163356" strokeWidth="3.5" fill="#F5F1EA"/>
    <circle cx="192" cy="196" r="11" fill="#ECE8E2" stroke="#163356" strokeWidth="2.5"/>
    <path d="M60 76 L46 168 H234 L218 76 Z" fill="#F5F1EA" stroke="#163356" strokeWidth="3.5" strokeLinejoin="round"/>
    <path d="M60 76 C60 76 68 26 140 26 C212 26 218 76 218 76" stroke="#163356" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <rect x="96" y="36" width="88" height="48" rx="12" fill="white" stroke="#163356" strokeWidth="2" opacity="0.9"/>
    <path d="M108 60 Q140 46 172 60" stroke="#C8D8C8" strokeWidth="2" strokeLinecap="round"/>
    <path d="M88 76 Q140 96 192 76" stroke="#F47A3C" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M46 168 L22 210" stroke="#163356" strokeWidth="4" strokeLinecap="round"/>
    <path d="M12 210 Q24 204 36 212" stroke="#163356" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <line x1="16" y1="207" x2="38" y2="215" stroke="#163356" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="209" r="3.5" fill="#F47A3C"/>
    <circle cx="32" cy="212" r="3.5" fill="#F47A3C"/>
    <path d="M88 120 Q140 134 192 120" stroke="#C8D8C8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="8 6"/>
  </svg>
);

const WHY_BUY = [
  { icon: Zap, title: 'Sterilize Edilmiş', desc: 'Her ürün satış öncesi profesyonelce temizlenir.' },
  { icon: ShieldCheck, title: 'Uzman Kontrolü', desc: '20 maddelik fiziksel kontrol listesiyle onaylanır.' },
  { icon: BadgeCheck, title: 'Orijinal Aksesuarlar', desc: 'Orijinal parçaları ve aksesuarlarıyla teslim edilir.' },
  { icon: RefreshCcw, title: 'İade Garantisi', desc: '7 gün içinde sorunsuz iade imkânı.' },
  { icon: Truck, title: 'Hızlı Teslimat', desc: 'Sipariş günü kargoya verilir, 1–3 gün teslimat.' },
];

const TRUST_STATS = [
  { value: '500+', label: 'Mutlu Aile', icon: '👨‍👩‍👧' },
  { value: '%98', label: 'Müşteri Memnuniyeti', icon: '⭐' },
  { value: '%100', label: 'Kontrol Edilmiş Ürün', icon: '✓' },
];

const SECTIONS = ['Genel Bakış', 'Özellikler', 'Durum Raporu', 'Kargo & İade', 'SSS'];

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.07, ease } }),
};

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { addItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const prod: Product | null = data?.product ?? null;
        if (prod) {
          setProduct(prod);
          fetch('/api/products')
            .then((r) => r.json())
            .then((res: { products: Product[] }) =>
              setRelated((res.products || []).filter((p) => p.category === prod.category && p.slug !== slug && p.stock > 0).slice(0, 4))
            );
        }
        setLoading(false);
      });
  }, [slug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF8F4' }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-3xl" style={{ background: 'linear-gradient(135deg, #F47A3C, #163356)' }} />
          <p className="text-sm font-medium" style={{ color: '#8E8E8E' }}>Yükleniyor…</p>
        </motion.div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: '#FAF8F4' }}>
        <p className="font-serif text-3xl font-bold" style={{ color: '#163356' }}>Ürün bulunamadı</p>
        <Link href="/urunler" className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-2xl" style={{ background: '#F47A3C' }}>
          <ArrowLeft size={16} /> Ürünlere Dön
        </Link>
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const outOfStock = product.stock === 0;
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price : null;
  const installment = Math.round(product.price / 12);
  const images = product.image ? [product.image] : [];
  const activeImage = images[selectedImage] ?? product.image;

  return (
    <div style={{ background: '#FAF8F4', minHeight: '100vh' }}>

      {/* ── Breadcrumb ── */}
      <div className="pt-24 pb-0">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium mb-8" style={{ color: '#8E8E8E' }}>
            <Link href="/" className="hover:text-[#163356] transition-colors">Ana Sayfa</Link>
            <ChevronRight size={12} />
            <Link href="/urunler" className="hover:text-[#163356] transition-colors">Ürünler</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#163356' }} className="truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Two‑Column Layout ── */}
      <div className="max-w-[1500px] mx-auto px-6 sm:px-8 pb-24">
        <div className="grid lg:grid-cols-[55%_45%] gap-14 items-start">

          {/* ════ LEFT — Gallery ════ */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="lg:sticky top-24"
          >
            {/* Main image */}
            <div
              className="relative overflow-hidden flex items-center justify-center cursor-zoom-in"
              style={{
                borderRadius: 36,
                background: 'radial-gradient(ellipse at 55% 40%, #F9F6F0 0%, #EDE7DB 60%, #E3D9CC 100%)',
                aspectRatio: '1/1',
                boxShadow: '0 4px 40px rgba(22,51,86,0.08)',
              }}
              onClick={() => setZoomed(true)}
            >
              {outOfStock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10" style={{ borderRadius: 36 }}>
                  <span className="font-bold text-sm px-5 py-2.5 rounded-full text-white" style={{ background: 'rgba(22,51,86,0.85)' }}>Tükendi</span>
                </div>
              )}

              {/* Discount badge */}
              {discount && (
                <div className="absolute top-5 left-5 z-10">
                  <span className="font-bold text-xs px-4 py-2 rounded-full text-white" style={{ background: '#163356' }}>-%{discount}</span>
                </div>
              )}

              {/* Stock badge */}
              {!outOfStock && product.stock === 1 && (
                <div className="absolute top-5 right-5 z-10">
                  <span
                    className="text-xs font-bold px-4 py-2 rounded-full"
                    style={{ background: 'rgba(244,122,60,0.12)', border: '1px solid rgba(244,122,60,0.3)', color: '#C44A15' }}
                  >
                    Sadece 1 Adet
                  </span>
                </div>
              )}

              {/* Fullscreen button */}
              <button
                className="absolute bottom-5 right-5 z-10 flex items-center justify-center rounded-2xl"
                style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.8)' }}
                onClick={(e) => { e.stopPropagation(); setZoomed(true); }}
              >
                <Maximize2 size={16} style={{ color: '#163356' }} />
              </button>

              {activeImage ? (
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute inset-0 w-full h-full object-cover ${outOfStock ? 'opacity-35 grayscale' : ''}`}
                  style={{ borderRadius: 36 }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.4, ease }}
                />
              ) : (
                <motion.div
                  className={`w-[65%] h-[65%] ${outOfStock ? 'opacity-35 grayscale' : ''}`}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {STROLLER_SVG}
                </motion.div>
              )}

              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(244,122,60,0.04) 0%, transparent 70%)' }} />
            </div>

            {/* Thumbnail row — only when more than one image */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(i)}
                    className="overflow-hidden flex items-center justify-center transition-all"
                    style={{
                      width: 88,
                      aspectRatio: '1/1',
                      borderRadius: 16,
                      border: selectedImage === i ? '2px solid #F47A3C' : '1.5px solid #ECE8E2',
                      opacity: selectedImage === i ? 1 : 0.6,
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" style={{ borderRadius: 14 }} />
                  </button>
                ))}
              </div>
            )}

            {/* Action row under gallery */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: '🔍', label: '360° Görünüm' },
                { icon: '🎬', label: 'Video' },
                { icon: '↔', label: 'Önce / Sonra' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-semibold transition-colors hover:border-[#163356]"
                  style={{ border: '1.5px solid #ECE8E2', background: 'white', color: '#163356' }}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ════ RIGHT — Product Info ════ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="flex flex-col gap-7"
          >
            {/* Category pill */}
            <div>
              <span className="text-[10px] font-bold tracking-[3px] uppercase" style={{ color: '#F47A3C' }}>
                {getCategoryLabel(product.category)}
              </span>
            </div>

            {/* Title */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="font-serif font-bold leading-[1.1]"
              style={{ fontSize: 'clamp(28px, 3vw, 42px)', color: '#163356' }}
            >
              {product.name}
            </motion.h1>

            {/* Stars row */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} className="fill-[#F47A3C] text-[#F47A3C]" />)}
              </div>
              <span className="font-bold text-sm" style={{ color: '#163356' }}>5.0</span>
              <span className="text-xs" style={{ color: '#8E8E8E' }}>· Premium Kalite · Uzman Onaylı</span>
            </div>

            {/* Price block */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="flex flex-col gap-1.5 p-6 rounded-3xl"
              style={{ background: 'white', border: '1px solid #ECE8E2' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-base line-through mb-0.5" style={{ color: '#8E8E8E' }}>{formatPrice(product.originalPrice)}</p>
                  )}
                  <p className="font-serif font-bold leading-none" style={{ fontSize: 44, color: '#163356' }}>
                    {formatPrice(product.price)}
                  </p>
                  {savings && (
                    <p className="text-sm font-semibold mt-1.5" style={{ color: '#2E7D52' }}>
                      {formatPrice(savings)} tasarruf · -%{discount}
                    </p>
                  )}
                </div>
                {savings && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-white mt-1" style={{ background: '#2E7D52' }}>
                    İNDİRİM
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-3 mt-1" style={{ borderTop: '1px solid #ECE8E2' }}>
                <CreditCard size={14} style={{ color: '#8E8E8E' }} />
                <span className="text-xs font-medium" style={{ color: '#8E8E8E' }}>
                  Ayda <strong style={{ color: '#163356' }}>{formatPrice(installment)}</strong>&apos;den başlayan taksit seçenekleri
                </span>
              </div>
            </motion.div>

            {/* Quality Panel */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="p-6 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(22,51,86,0.03) 0%, rgba(22,51,86,0.06) 100%)',
                border: '1px solid #ECE8E2',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8E8E8E' }}>Ürün Durumu</p>
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(46,125,82,0.1)', color: '#2E7D52' }}>
                  <ShieldCheck size={11} /> Uzman Onaylı
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Puan', value: '9.8 / 10' },
                  { label: 'Sınıf', value: 'Neredeyse Sıfır' },
                  { label: 'Model Yılı', value: '2025' },
                  { label: 'Kullanım', value: '3 Ay' },
                  { label: 'Kontrol Tarihi', value: 'Haziran 2026' },
                  { label: 'Garanti', value: 'Dahil' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5 p-3 rounded-2xl" style={{ background: 'white', border: '1px solid #ECE8E2' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8E8E8E' }}>{label}</p>
                    <p className="font-semibold text-sm" style={{ color: '#163356' }}>{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col gap-3"
            >
              {outOfStock ? (
                <div className="flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold" style={{ background: '#F5F1EA', color: '#8E8E8E' }}>
                  <Package size={18} /> Bu Ürün Tükendi
                </div>
              ) : inCart ? (
                <Link href="/sepet" className="flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white transition-all" style={{ background: '#163356', borderRadius: 18 }}>
                  <Check size={18} /> Sepete Eklendi — Görüntüle
                </Link>
              ) : (
                <motion.button
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price, slug: product.slug, gradient: '', image: product.image })}
                  whileHover={{ scale: 1.015, boxShadow: '0 16px 48px rgba(244,122,60,0.45)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 py-4.5 rounded-[18px] font-bold text-white text-base"
                  style={{
                    background: 'linear-gradient(135deg, #F47A3C 0%, #D4571F 100%)',
                    boxShadow: '0 8px 32px rgba(244,122,60,0.38)',
                    paddingTop: 18,
                    paddingBottom: 18,
                    borderRadius: 18,
                  }}
                >
                  <ShoppingCart size={20} />
                  Sepete Ekle
                  <ArrowRight size={18} />
                </motion.button>
              )}

              <button className="flex items-center justify-center gap-3 py-4 rounded-[18px] font-bold text-base transition-all hover:bg-[#163356] hover:text-white" style={{ border: '2px solid #163356', color: '#163356', borderRadius: 18 }}>
                Hemen Satın Al
              </button>

              {/* Floating action row */}
              <div className="flex items-center justify-center gap-3 pt-1">
                {(() => {
                  const faved = isFavorite(product.id);
                  const actions = [
                    {
                      icon: Heart,
                      label: faved ? 'Favoride' : 'Favorile',
                      active: faved,
                      onClick: () => toggleFavorite({ id: product.id, name: product.name, slug: product.slug, price: product.price, image: product.image, category: product.category }),
                    },
                    { icon: BarChart2, label: 'Karşılaştır', active: false, onClick: () => {} },
                    {
                      icon: Share2,
                      label: 'Paylaş',
                      active: false,
                      onClick: () => {
                        if (navigator.share) navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                        else { navigator.clipboard?.writeText(window.location.href); }
                      },
                    },
                  ];
                  return actions.map(({ icon: Icon, label, active, onClick }) => (
                    <motion.button
                      key={label}
                      onClick={onClick}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.93 }}
                      className="flex flex-col items-center gap-1.5"
                      aria-label={label}
                      aria-pressed={active}
                    >
                      <span
                        className="flex items-center justify-center rounded-full transition-colors"
                        style={{
                          width: 48, height: 48,
                          background: active ? 'rgba(239,68,68,0.1)' : 'white',
                          border: active ? '1.5px solid rgba(239,68,68,0.3)' : '1.5px solid #ECE8E2',
                          color: active ? '#EF4444' : '#163356',
                          boxShadow: '0 2px 12px rgba(22,51,86,0.08)',
                        }}
                      >
                        <Icon size={18} fill={active ? '#EF4444' : 'none'} />
                      </span>
                      <span className="text-[10px] font-semibold" style={{ color: '#8E8E8E' }}>{label}</span>
                    </motion.button>
                  ));
                })()}
              </div>
            </motion.div>

            {/* Delivery Timeline */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="p-6 rounded-3xl"
              style={{ background: 'white', border: '1px solid #ECE8E2' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8E8E8E' }}>Teslimat</p>
              <div className="flex items-start gap-0">
                {[
                  { icon: Clock, label: 'Bugün Sipariş Ver', sub: 'Hemen işleme alınır', color: '#F47A3C' },
                  { icon: Zap, label: 'Yarın Kargo', sub: '1 iş günü', color: '#163356' },
                  { icon: Truck, label: '1–3 Gün Teslimat', sub: 'Türkiye geneli', color: '#2E7D52' },
                ].map(({ icon: Icon, label, sub, color }, i) => (
                  <div key={label} className="flex flex-1 flex-col items-center text-center relative">
                    <div className="flex items-center justify-center rounded-2xl mb-3" style={{ width: 44, height: 44, background: `${color}14`, color }}>
                      <Icon size={18} />
                    </div>
                    {i < 2 && (
                      <div className="absolute top-[22px] left-[calc(50%+22px)] right-0 h-px" style={{ background: '#ECE8E2', zIndex: 0 }} />
                    )}
                    <p className="text-[11px] font-bold" style={{ color: '#163356' }}>{label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#8E8E8E' }}>{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Why Buy */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8E8E8E' }}>Neden Güvenle Alın?</p>
              <div className="flex flex-col gap-2.5">
                {WHY_BUY.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:border-[#163356]/20" style={{ background: 'white', border: '1px solid #ECE8E2' }}>
                    <div className="flex items-center justify-center shrink-0 rounded-xl" style={{ width: 40, height: 40, background: 'rgba(22,51,86,0.05)', color: '#163356' }}>
                      <Icon size={17} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#163356' }}>{title}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#8E8E8E' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ════ DESCRIPTION SECTIONS ════ */}
        <div className="mt-24">
          {/* Section nav */}
          <div className="flex gap-1 flex-wrap mb-16" style={{ borderBottom: '1px solid #ECE8E2', paddingBottom: 0 }}>
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => setActiveSection(i)}
                className="px-5 py-3 text-sm font-semibold transition-all relative"
                style={{ color: activeSection === i ? '#163356' : '#8E8E8E' }}
              >
                {s}
                {activeSection === i && (
                  <motion.div layoutId="section-underline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#F47A3C' }} />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
            >
              {activeSection === 0 && (
                <div className="max-w-3xl">
                  <h2 className="font-serif font-bold text-3xl mb-6" style={{ color: '#163356' }}>Genel Bakış</h2>
                  <p className="text-base leading-relaxed mb-5" style={{ color: '#4A4A5A' }}>{product.description}</p>
                  <p className="text-base leading-relaxed" style={{ color: '#4A4A5A' }}>
                    Bu ürün ikinci el olup detaylı fiziksel kontrolden geçmiştir. Ürün durumu açıklamaya tam olarak yansıtılmıştır.
                    Tüm fotoğraflar gerçek ürünü göstermektedir. Herhangi bir sorunuz için doğrudan bize ulaşabilirsiniz.
                  </p>
                </div>
              )}
              {activeSection === 1 && (
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                  {[
                    { label: 'Kategori', value: getCategoryLabel(product.category) },
                    { label: 'Stok', value: product.stock > 0 ? `${product.stock} adet` : 'Tükendi' },
                    { label: 'Durum', value: 'İkinci El — İyi Durumda' },
                    { label: 'Kontrol', value: 'Uzman Onaylı' },
                    { label: 'Kargo', value: 'Türkiye Geneli' },
                    { label: 'İade', value: '7 Gün' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center p-4 rounded-2xl" style={{ background: 'white', border: '1px solid #ECE8E2' }}>
                      <span className="text-sm font-semibold" style={{ color: '#8E8E8E' }}>{label}</span>
                      <span className="text-sm font-bold" style={{ color: '#163356' }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeSection === 2 && (
                <div className="max-w-3xl">
                  <h2 className="font-serif font-bold text-3xl mb-8" style={{ color: '#163356' }}>Durum Raporu</h2>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'Genel Görünüm', score: 10, note: 'Kusursuz, hiç hasar yok' },
                      { label: 'Mekanizma', score: 10, note: 'Tüm kilitler ve açma/kapama mekanizması tam çalışır' },
                      { label: 'Tekerlekler', score: 9, note: 'Hafif kullanım izi mevcut' },
                      { label: 'Kumaş', score: 10, note: 'Temiz ve lekesiz' },
                      { label: 'Aksesuarlar', score: 10, note: 'Tüm orijinal aksesuarlar tam' },
                    ].map(({ label, score, note }) => (
                      <div key={label} className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid #ECE8E2' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm" style={{ color: '#163356' }}>{label}</span>
                          <span className="font-bold text-sm" style={{ color: '#F47A3C' }}>{score}/10</span>
                        </div>
                        <div className="h-1.5 rounded-full mb-2" style={{ background: '#ECE8E2' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score * 10}%` }}
                            transition={{ duration: 0.8, ease }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #F47A3C, #D4571F)' }}
                          />
                        </div>
                        <p className="text-xs" style={{ color: '#8E8E8E' }}>{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === 3 && (
                <div className="max-w-3xl flex flex-col gap-5">
                  {[
                    { icon: Truck, title: 'Kargo Bilgisi', color: '#163356', body: 'Türkiye genelinde anlaşmalı kargo firmaları ile güvenli gönderim yapılmaktadır. Sipariş onayından sonra 1–3 iş günü içinde kargoya verilir.' },
                    { icon: RefreshCcw, title: 'İade Politikası', color: '#2E7D52', body: 'Ürün tesliminden itibaren 7 gün içinde iade talebinde bulunabilirsiniz. İade kargo ücreti alıcıya aittir. Ürün kullanılmamış ve eksiksiz olmalıdır.' },
                  ].map(({ icon: Icon, title, color, body }) => (
                    <div key={title} className="flex gap-5 p-6 rounded-3xl" style={{ background: 'white', border: '1px solid #ECE8E2' }}>
                      <div className="flex items-center justify-center shrink-0 rounded-2xl" style={{ width: 52, height: 52, background: `${color}10`, color }}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="font-bold mb-2" style={{ color: '#163356' }}>{title}</p>
                        <p className="text-sm leading-relaxed" style={{ color: '#8E8E8E' }}>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeSection === 4 && (
                <div className="max-w-3xl flex flex-col gap-4">
                  {[
                    { q: 'Bu ürün gerçekten ikinci el mi?', a: 'Evet, tüm ürünlerimiz özenle seçilmiş ikinci el ürünlerdir. Her biri uzman kontrolünden geçmektedir.' },
                    { q: 'Fotoğraflar gerçek ürünü gösteriyor mu?', a: 'Evet, tüm fotoğraflar satışa sunulan gerçek ürüne aittir. Stüdyo ya da temsili görsel kullanılmaz.' },
                    { q: 'Kargo ne zaman çıkar?', a: 'Sipariş onayından sonra aynı ya da ertesi iş günü kargoya verilir.' },
                    { q: 'Ürünü beğenmezsem ne olur?', a: '7 gün içinde sorunsuz iade hakkınız bulunmaktadır.' },
                  ].map(({ q, a }) => (
                    <div key={q} className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid #ECE8E2' }}>
                      <p className="font-bold mb-2 text-sm" style={{ color: '#163356' }}>{q}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#8E8E8E' }}>{a}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ════ TRUST BLOCK ════ */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mt-24 rounded-[36px] p-14 text-center"
          style={{ background: 'white', border: '1px solid #ECE8E2' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F47A3C' }}>Neden Biz?</p>
          <h2 className="font-serif font-bold text-4xl mb-12" style={{ color: '#163356' }}>Güvenle Alışveriş Yapın</h2>
          <div className="grid grid-cols-3 gap-8">
            {TRUST_STATS.map(({ value, label, icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-4xl mb-1">{icon}</span>
                <p className="font-serif font-bold" style={{ fontSize: 40, color: '#163356', lineHeight: 1 }}>{value}</p>
                <p className="text-sm font-semibold" style={{ color: '#8E8E8E' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════ RELATED PRODUCTS ════ */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mt-24"
          >
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#F47A3C' }}>Benzer Ürünler</p>
                <h2 className="font-serif font-bold text-3xl" style={{ color: '#163356' }}>İlginizi Çekebilir</h2>
              </div>
              <Link href="/urunler" className="flex items-center gap-1.5 text-sm font-semibold hover:text-[#F47A3C] transition-colors" style={{ color: '#163356' }}>
                Tümünü Gör <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <motion.div key={p.id} whileHover={{ y: -8 }} transition={{ duration: 0.3, ease }}>
                  <Link
                    href={`/urun/${p.slug}`}
                    className="block overflow-hidden"
                    style={{ background: 'white', borderRadius: 24, border: '1px solid #ECE8E2', boxShadow: '0 2px 16px rgba(22,51,86,0.05)' }}
                  >
                    <div
                      className="flex items-center justify-center overflow-hidden"
                      style={{ aspectRatio: '4/3', background: 'radial-gradient(ellipse at center, #F5EFE6, #EDE6DA)' }}
                    >
                      {p.image ? (
                        <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 opacity-75">{STROLLER_SVG}</div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="font-serif font-bold text-sm mb-2 line-clamp-2" style={{ color: '#163356' }}>{p.name}</p>
                      <p className="font-bold" style={{ color: '#F47A3C' }}>{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ════ BOTTOM CTA BANNER ════ */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mt-20 rounded-[36px] overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #0A1E35 0%, #163356 60%, #1F4A7A 100%)',
            padding: '80px 64px',
          }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(244,122,60,0.8)' }}>Premium İkinci El</p>
              <h2 className="font-serif font-bold text-4xl mb-3 text-white leading-tight">
                Her Bebek Güvenli<br />Bir Yolculuğu Hak Eder
              </h2>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>Premium kalite, uygun fiyat.</p>
            </div>
            <Link
              href="/urunler"
              className="flex items-center gap-3 font-bold text-white px-8 py-4 rounded-2xl shrink-0"
              style={{ background: 'linear-gradient(135deg, #F47A3C, #D4571F)', boxShadow: '0 8px 32px rgba(244,122,60,0.45)' }}
            >
              <ShoppingCart size={18} /> Alışverişe Başla
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3" style={{ background: '#F47A3C' }} />
          <div className="absolute right-16 bottom-0 w-40 h-40 rounded-full opacity-5 translate-y-1/2" style={{ background: 'white' }} />
        </motion.div>
      </div>

      {/* ── Zoom Modal ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-zoom-out p-8"
            style={{ background: 'rgba(10,30,53,0.92)', backdropFilter: 'blur(16px)' }}
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.35, ease }}
              className="w-full max-w-2xl rounded-[36px] flex items-center justify-center overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at center, #F9F6F0, #EDE7DB)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-auto object-contain" />
              ) : (
                <div className="p-16">{STROLLER_SVG}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

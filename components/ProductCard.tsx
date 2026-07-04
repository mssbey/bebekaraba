'use client';

import Link from 'next/link';
import { ShoppingCart, Check, Package, Heart, BarChart2, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from './CartProvider';
import { useFavorites } from './FavoritesProvider';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  stock: number;
  featured?: number | boolean;
  category: string;
  description: string;
  image?: string;
}

/* ── SVG illustrations ── */
const STROLLER_SVG = (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="42" cy="84" r="9" stroke="#163356" strokeWidth="2.5"/>
    <circle cx="42" cy="84" r="4" fill="#ECE8E2" stroke="#163356" strokeWidth="1.5"/>
    <circle cx="82" cy="84" r="9" stroke="#163356" strokeWidth="2.5"/>
    <circle cx="82" cy="84" r="4" fill="#ECE8E2" stroke="#163356" strokeWidth="1.5"/>
    <path d="M28 30 L20 75 H90 L80 30 Z" fill="#F5F1EA" stroke="#163356" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M28 30 C28 30 30 14 55 14 C80 14 80 30 80 30" stroke="#163356" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <rect x="38" y="18" width="34" height="18" rx="6" fill="white" stroke="#163356" strokeWidth="1.5" opacity="0.9"/>
    <path d="M44 26 Q55 20 67 26" stroke="#C8D8C8" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M33 30 Q55 38 77 30" stroke="#F47A3C" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M20 75 L10 88" stroke="#163356" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M6 88 L14 91" stroke="#163356" strokeWidth="2" strokeLinecap="round"/>
    <path d="M42 55 Q55 60 68 55" stroke="#C8D8C8" strokeWidth="1.2" strokeDasharray="5 4" strokeLinecap="round"/>
  </svg>
);

const CARSEAT_SVG = (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="30" y="18" width="60" height="58" rx="12" fill="#F5F1EA" stroke="#163356" strokeWidth="2"/>
    <rect x="38" y="26" width="44" height="32" rx="8" fill="#ECE8E2" stroke="#163356" strokeWidth="1.5"/>
    <path d="M38 58 Q60 72 82 58" stroke="#163356" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="42" y="62" width="36" height="8" rx="4" fill="#C8D8C8" stroke="#163356" strokeWidth="1.5"/>
    <rect x="46" y="30" width="8" height="22" rx="4" fill="#F47A3C" opacity="0.8"/>
    <rect x="66" y="30" width="8" height="22" rx="4" fill="#F47A3C" opacity="0.8"/>
  </svg>
);

const ACCESSORY_SVG = (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="25" y="35" width="70" height="40" rx="10" fill="#F5F1EA" stroke="#163356" strokeWidth="2"/>
    <rect x="45" y="22" width="30" height="18" rx="6" fill="#ECE8E2" stroke="#163356" strokeWidth="2"/>
    <circle cx="60" cy="55" r="10" fill="#F47A3C" opacity="0.15" stroke="#F47A3C" strokeWidth="1.5"/>
    <path d="M55 55 L58 58 L66 50" stroke="#F47A3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function getIllustration(category: string) {
  if (category === 'oto-koltugu') return CARSEAT_SVG;
  if (category === 'aksesuar') return ACCESSORY_SVG;
  return STROLLER_SVG;
}

function getCategoryLabel(category: string) {
  if (category === 'oto-koltugu') return 'Oto Koltuğu';
  if (category === 'aksesuar') return 'Aksesuar';
  return 'Bebek Arabası';
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const inCart = isInCart(product.id);
  const faved = isFavorite(product.id);
  const outOfStock = product.stock === 0;
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className="group relative bg-white flex flex-col"
      style={{
        borderRadius: 32,
        boxShadow: '0 2px 20px rgba(22,51,86,0.06)',
        border: '1px solid #ECE8E2',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 32px 80px rgba(22,51,86,0.14)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 20px rgba(22,51,86,0.06)';
      }}
    >
      {/* ── Floating Pills ── */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
        {product.featured && (
          <span className="inline-flex items-center gap-1.5 bg-[#163356] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
            <span className="text-[#F47A3C]">★</span> Premium Seçim
          </span>
        )}
      </div>
      {!outOfStock && product.stock === 1 && (
        <div className="absolute top-5 right-5 z-20">
          <span
            className="inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(244,122,60,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(244,122,60,0.25)',
              color: '#C44A15',
            }}
          >
            Sadece 1 Adet
          </span>
        </div>
      )}
      {discount && (
        <div className="absolute top-5 right-5 z-20">
          <span className="inline-flex items-center bg-[#163356] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
            -%{discount}
          </span>
        </div>
      )}

      {/* ── Image Area ── */}
      <Link href={`/urun/${product.slug}`} aria-label={product.name} className="block overflow-hidden" style={{ borderRadius: '32px 32px 0 0' }}>
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            aspectRatio: '4/3',
            background: 'radial-gradient(ellipse at 60% 40%, #F9F6F0 0%, #F0EBE2 60%, #E8E1D5 100%)',
          }}
        >
          {/* Glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(244,122,60,0.08) 0%, transparent 70%)' }}
          />

          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10" style={{ borderRadius: '32px 32px 0 0' }}>
              <span className="bg-[#163356]/80 text-white text-xs font-semibold px-4 py-2 rounded-full">Tükendi</span>
            </div>
          )}

          {product.image ? (
            <motion.img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover ${outOfStock ? 'opacity-40 grayscale' : ''}`}
              whileHover={{ scale: 1.06, rotate: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <motion.div
              className={`w-full h-full max-w-[160px] max-h-[140px] ${outOfStock ? 'opacity-35 grayscale' : ''}`}
              whileHover={{ scale: 1.06, rotate: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {getIllustration(product.category)}
            </motion.div>
          )}

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.7), transparent)' }} />
        </div>
      </Link>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-7 gap-4">

        {/* Category */}
        <p className="text-[10px] font-bold uppercase tracking-[2px]" style={{ color: '#8E8E8E' }}>
          {getCategoryLabel(product.category)}
        </p>

        {/* Title */}
        <Link href={`/urun/${product.slug}`}>
          <h3
            className="font-serif font-bold leading-snug line-clamp-2 hover:text-[#F47A3C] transition-colors duration-200"
            style={{ fontSize: '17px', color: '#163356' }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Quality Score */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: '#FAF8F4', border: '1px solid #ECE8E2' }}
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#F47A3C] text-xs">★</span>
            ))}
          </div>
          <span className="font-bold text-xs" style={{ color: '#163356' }}>9.8 / 10</span>
          <span className="w-px h-3.5" style={{ background: '#ECE8E2' }} />
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#2E7D52' }}>
            <ShieldCheck size={11} className="shrink-0" />
            Uzman Kontrolünden Geçti
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm line-through" style={{ color: '#8E8E8E' }}>{formatPrice(product.originalPrice)}</p>
          )}
          <p className="font-serif font-bold" style={{ fontSize: '26px', color: '#163356', lineHeight: 1 }}>
            {formatPrice(product.price)}
          </p>
          {savings && (
            <p className="text-[11px] font-semibold" style={{ color: '#2E7D52' }}>
              {formatPrice(savings)} tasarruf ettiniz
            </p>
          )}
          <p className="flex items-center gap-1.5 text-[11px] mt-1" style={{ color: '#8E8E8E' }}>
            <CreditCard size={11} />
            12 Aya Varan Taksit
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-auto">
          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleFavorite({ id: product.id, name: product.name, slug: product.slug, price: product.price, image: product.image, category: product.category })}
            className="flex items-center justify-center shrink-0 rounded-xl transition-colors"
            style={{
              width: 46,
              height: 46,
              background: faved ? 'rgba(239,68,68,0.1)' : 'rgba(22,51,86,0.05)',
              backdropFilter: 'blur(8px)',
              border: faved ? '1px solid rgba(239,68,68,0.3)' : '1px solid #ECE8E2',
              color: faved ? '#EF4444' : '#163356',
            }}
            aria-label={faved ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            aria-pressed={faved}
          >
            <Heart size={17} fill={faved ? '#EF4444' : 'none'} />
          </motion.button>

          {/* Compare */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center shrink-0 rounded-xl"
            style={{
              width: 46,
              height: 46,
              background: 'rgba(22,51,86,0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #ECE8E2',
              color: '#163356',
            }}
            aria-label="Karşılaştır"
          >
            <BarChart2 size={17} />
          </motion.button>

          {/* CTA */}
          {outOfStock ? (
            <div
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              style={{ background: '#F5F1EA', color: '#8E8E8E' }}
            >
              <Package size={15} /> Tükendi
            </div>
          ) : inCart ? (
            <Link
              href="/sepet"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#163356', color: 'white', borderRadius: 14 }}
            >
              <Check size={15} /> Sepette
            </Link>
          ) : (
            <motion.button
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, slug: product.slug, gradient: '', image: product.image })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white overflow-hidden relative group/btn"
              style={{
                background: 'linear-gradient(135deg, #F47A3C 0%, #D4571F 100%)',
                borderRadius: 14,
                boxShadow: '0 6px 24px rgba(244,122,60,0.35)',
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"
                style={{ background: 'linear-gradient(135deg, #FF8F5E 0%, #E06025 100%)' }}
              />
              <span className="relative flex items-center gap-2">
                <ShoppingCart size={15} />
                Sepete Ekle
                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </span>
            </motion.button>
          )}
        </div>

        {/* Luxury chips */}
        <div className="flex items-center gap-2 pt-1">
          {['✓ Garantili', '✓ Hijyen Kontrolü', '✓ Hızlı Teslimat'].map((chip) => (
            <span
              key={chip}
              className="text-[9px] font-bold tracking-wide"
              style={{ color: '#8E8E8E' }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

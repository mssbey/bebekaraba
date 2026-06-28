'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { useFavorites } from './FavoritesProvider';
import { useCart } from './CartProvider';

const ease = [0.22, 1, 0.36, 1] as const;

function formatPrice(p: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(p);
}

const MiniStroller = (
  <svg viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="58" r="8" stroke="#1B3A5C" strokeWidth="2" fill="#EBF2EB" />
    <circle cx="56" cy="58" r="8" stroke="#1B3A5C" strokeWidth="2" fill="#EBF2EB" />
    <path d="M14 20 L10 52 H66 L58 20 Z" fill="#EBF2EB" stroke="#1B3A5C" strokeWidth="2" />
    <path d="M14 20 C14 20 18 6 40 6 C62 6 58 20 58 20" stroke="#1B3A5C" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export default function FavoritesDrawer() {
  const { favorites, removeFavorite, isOpen, closeFavorites } = useFavorites();
  const { addItem, isInCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-navy-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeFavorites}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[61] h-full w-full max-w-[420px] bg-cream flex flex-col shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
            role="dialog" aria-label="Favoriler"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE9E4] bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Heart size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="font-serif font-bold text-navy-900">Favorilerim</p>
                  <p className="text-xs text-charcoal/50">{favorites.length} ürün</p>
                </div>
              </div>
              <button onClick={closeFavorites} aria-label="Kapat" className="w-9 h-9 rounded-xl flex items-center justify-center text-charcoal/50 hover:bg-cream-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-20 h-20 mb-5 bg-red-50 rounded-3xl flex items-center justify-center">
                  <Heart size={34} className="text-red-300" />
                </div>
                <h3 className="font-serif font-bold text-xl text-navy-900 mb-2">Favori Listeniz Boş</h3>
                <p className="text-charcoal/55 text-sm mb-6">Beğendiğiniz ürünleri kalbe dokunarak kaydedin.</p>
                <button onClick={closeFavorites} className="btn-orange inline-flex items-center gap-2 px-6 py-3 rounded-2xl">
                  Ürünleri Keşfet <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                {favorites.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
                    className="bg-white rounded-2xl border border-[#EDE9E4] p-3.5 flex gap-3.5 items-center"
                  >
                    <Link href={`/urun/${item.slug}`} onClick={closeFavorites} className="w-16 h-16 rounded-xl bg-sage-50 flex-shrink-0 flex items-center justify-center overflow-hidden p-2">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : MiniStroller}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/urun/${item.slug}`} onClick={closeFavorites} className="font-semibold text-charcoal hover:text-navy-700 text-sm leading-snug block line-clamp-2 mb-1">
                        {item.name}
                      </Link>
                      <p className="font-bold text-navy-700 text-sm mb-1.5">{formatPrice(item.price)}</p>
                      {!isInCart(item.id) && (
                        <button
                          onClick={() => addItem({ id: item.id, name: item.name, price: item.price, slug: item.slug, gradient: '', image: item.image })}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 hover:text-orange-700"
                        >
                          <ShoppingCart size={12} /> Sepete Ekle
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      aria-label={`${item.name} favorilerden çıkar`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal/35 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

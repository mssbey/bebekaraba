'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
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
    <path d="M10 52 L4 62" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 18 Q40 26 20 18" stroke="#F4723A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function CartDrawer() {
  const { items, removeItem, total, isOpen, closeCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const shipping = total > 0 ? 150 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[60] bg-navy-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 z-[61] h-full w-full max-w-[420px] bg-cream flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
            role="dialog"
            aria-label="Sepet"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE9E4] bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="font-serif font-bold text-navy-900">Sepetim</p>
                  <p className="text-xs text-charcoal/50">{items.length} ürün</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="Kapat"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-charcoal/50 hover:bg-cream-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-20 h-20 mb-5 bg-sage-100 rounded-3xl flex items-center justify-center">
                  <ShoppingBag size={34} className="text-charcoal/35" />
                </div>
                <h3 className="font-serif font-bold text-xl text-navy-900 mb-2">Sepetiniz Boş</h3>
                <p className="text-charcoal/55 text-sm mb-6">Harika ürünler sizi bekliyor!</p>
                <button onClick={closeCart} className="btn-orange inline-flex items-center gap-2 px-6 py-3 rounded-2xl">
                  Alışverişe Başla <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="bg-white rounded-2xl border border-[#EDE9E4] p-3.5 flex gap-3.5 items-center"
                    >
                      <div className="w-16 h-16 rounded-xl bg-sage-50 flex-shrink-0 flex items-center justify-center overflow-hidden p-2">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : MiniStroller}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/urun/${item.slug}`} onClick={closeCart} className="font-semibold text-charcoal hover:text-navy-700 text-sm leading-snug block line-clamp-2 mb-1">
                          {item.name}
                        </Link>
                        <p className="font-bold text-navy-700 text-sm">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`${item.name} ürününü çıkar`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal/35 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-[#EDE9E4] bg-white px-6 py-5 space-y-4">
                  <div className="flex items-center justify-center gap-5 text-[11px] text-charcoal/55">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-green-600" /> Güvenli Ödeme</span>
                    <span className="flex items-center gap-1.5"><Truck size={13} className="text-orange-500" /> Hızlı Kargo</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-charcoal/65">
                      <span>Ara toplam</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-charcoal/65">
                      <span>Kargo</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#EDE9E4]">
                      <span className="font-bold text-charcoal">Toplam</span>
                      <span className="font-bold text-xl text-navy-700">{formatPrice(total + shipping)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/sepet" onClick={closeCart} className="btn-navy flex-1 text-center py-3 rounded-xl text-sm">
                      Sepeti Gör
                    </Link>
                    <Link href="/siparis-ver" onClick={closeCart} className="btn-orange flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm">
                      Sipariş Ver <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

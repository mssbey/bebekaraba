'use client';

import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, Package } from 'lucide-react';
import { useCart } from '@/components/CartProvider';
import { useState } from 'react';

function formatPrice(p: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(p);
}

export default function SepetPage() {
  const { items, removeItem, clearCart, total } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [discount, setDiscount] = useState(0);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === 'BEBEK10') {
      const d = Math.round(total * 0.1);
      setDiscount(d);
      setCouponMsg({ text: `%10 indirim uygulandı! -${formatPrice(d)}`, ok: true });
    } else {
      setDiscount(0);
      setCouponMsg({ text: 'Geçersiz kupon kodu.', ok: false });
    }
  }

  const finalTotal = Math.max(0, total - discount);
  const shipping = finalTotal > 0 ? 150 : 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4 py-16">
          <div className="w-20 h-20 mx-auto mb-5 bg-sage-100 rounded-3xl flex items-center justify-center">
            <ShoppingBag size={36} className="text-charcoal/35" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-navy-900 mb-3">Sepetiniz Boş</h2>
          <p className="text-charcoal/55 mb-8 text-sm">
            Henüz sepetinize ürün eklemediniz. Harika ürünler sizi bekliyor!
          </p>
          <Link href="/urunler" className="btn-orange inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl">
            Alışverişe Başla <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/urunler" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-navy-700 transition-colors mb-4">
            <ArrowLeft size={15} /> Alışverişe Devam Et
          </Link>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Sepetim</h1>
          <p className="text-sm text-charcoal/50 mt-1">{items.length} ürün</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Items ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#EDE9E4] p-5 flex gap-5 items-start">
                {/* Mini illustration */}
                <div className="w-20 h-20 bg-sage-50 rounded-xl flex-shrink-0 flex items-center justify-center p-3">
                  <svg viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="24" cy="58" r="8" stroke="#1B3A5C" strokeWidth="2" fill="#EBF2EB"/>
                    <circle cx="56" cy="58" r="8" stroke="#1B3A5C" strokeWidth="2" fill="#EBF2EB"/>
                    <path d="M14 20 L10 52 H66 L58 20 Z" fill="#EBF2EB" stroke="#1B3A5C" strokeWidth="2"/>
                    <path d="M14 20 C14 20 18 6 40 6 C62 6 58 20 58 20" stroke="#1B3A5C" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M10 52 L4 62" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M60 18 Q40 26 20 18" stroke="#F4723A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/urun/${item.slug}`} className="font-semibold text-charcoal hover:text-navy-700 transition-colors text-sm leading-snug block mb-1 line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-xs text-charcoal/40 mb-3">Stok: 1 adet</p>
                  <p className="font-bold text-navy-700">{formatPrice(item.price)}</p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`${item.name} ürününü sepetten çıkar`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-charcoal/35 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-charcoal/45 hover:text-red-500 transition-colors flex items-center gap-1.5 mt-2"
            >
              <Trash2 size={13} /> Sepeti Temizle
            </button>
          </div>

          {/* ── Summary ────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5">
              <h3 className="flex items-center gap-2 font-semibold text-sm text-charcoal mb-3">
                <Tag size={15} className="text-orange-500" />
                Kupon Kodu
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  placeholder="Kodu girin..."
                  className="input-field flex-1 py-2.5 text-sm"
                />
                <button
                  onClick={applyCoupon}
                  className="btn-navy px-4 py-2.5 rounded-xl text-sm"
                >
                  Uygula
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 font-medium ${couponMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                  {couponMsg.text}
                </p>
              )}
              <p className="text-[11px] text-charcoal/35 mt-2">Deneme kodu: BEBEK10</p>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5">
              <h3 className="font-semibold text-charcoal mb-4">Sipariş Özeti</h3>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-charcoal/65 truncate max-w-[65%]">{item.name}</span>
                    <span className="font-medium text-charcoal">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#EDE9E4] pt-3 space-y-2">
                <div className="flex justify-between text-sm text-charcoal/65">
                  <span>Ara toplam</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>İndirim</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-charcoal/65">
                  <span>Kargo</span>
                  <span>{shipping > 0 ? formatPrice(shipping) : '—'}</span>
                </div>
              </div>

              <div className="border-t border-[#EDE9E4] mt-3 pt-3 flex justify-between">
                <span className="font-bold text-charcoal">Toplam</span>
                <span className="font-bold text-xl text-navy-700">{formatPrice(finalTotal + shipping)}</span>
              </div>

              <Link
                href="/siparis-ver"
                className="btn-orange flex items-center justify-center gap-2 w-full py-3.5 rounded-xl mt-5 text-base"
              >
                Siparişi Tamamla <ArrowRight size={16} />
              </Link>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-charcoal/40">
                <Package size={12} />
                Güvenli ödeme · SSL korumalı
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

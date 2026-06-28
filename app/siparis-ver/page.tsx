'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getUser, addOrder } from '@/lib/account';

export default function SiparisVerPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      setForm((f) => ({ ...f, customer_name: user.name, customer_email: user.email }));
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-2xl font-bold text-navy-700 mb-4">Sepetiniz boş</h1>
        <Link href="/urunler" className="text-brand-500 hover:underline">Ürünlere git</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
            product_id: i.id,
            product_name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sipariş oluşturulamadı');

      addOrder({
        order_number: data.order_number,
        email: form.customer_email,
        total,
        items: items.map(i => ({ product_id: i.id, product_name: i.name, price: i.price, quantity: i.quantity })),
        created_at: new Date().toISOString(),
      });

      clearCart();
      router.push(`/tesekkurler?siparis=${data.order_number}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/sepet" className="flex items-center gap-2 text-gray-500 hover:text-brand-500 transition-colors text-sm mb-6">
          <ArrowLeft size={16} /> Sepete Dön
        </Link>

        <h1 className="font-serif text-3xl font-bold text-navy-700 mb-8">Sipariş Bilgileri</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-500 rounded-full inline-block"></span>
                Kişisel Bilgiler
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                  <input
                    required
                    value={form.customer_name}
                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    required
                    type="email"
                    value={form.customer_email}
                    onChange={e => setForm({ ...form, customer_email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="ornek@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    value={form.customer_phone}
                    onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                  <input
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="İstanbul"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Adresi *</label>
                <textarea
                  required
                  rows={3}
                  value={form.customer_address}
                  onChange={e => setForm({ ...form, customer_address: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="Tam adresinizi yazın..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notlar (opsiyonel)</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="Kargo veya ürün ile ilgili özel notunuz..."
                />
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Shield size={16} />
                Ödeme Bilgisi
              </h3>
              <p className="text-sm text-amber-700">
                Siparişiniz onaylandıktan sonra satıcı sizinle iletişime geçecek ve ödeme detaylarını paylaşacaktır.
                EFT/Havale veya karşılıklı anlaşma ile teslim seçenekleri mevcuttur.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sipariş Veriliyor...' : 'Siparişi Onayla'}
            </button>
          </form>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <h2 className="font-semibold text-gray-900 mb-5">Sipariş Özeti</h2>

              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${item.gradient} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} adet</p>
                    </div>
                    <p className="text-sm font-semibold text-navy-700 flex-shrink-0">
                      {item.price.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-5 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ara Toplam</span>
                  <span className="font-bold text-navy-700 text-xl">
                    {total.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">✅ Kargo dahil</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

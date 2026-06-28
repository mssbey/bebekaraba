'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, LogOut, ShoppingBag, ArrowRight, Mail, Calendar, ChevronRight } from 'lucide-react';
import { getUser, logoutUser, getOrders, type AccountUser, type LocalOrder } from '@/lib/account';
import { useFavorites } from '@/components/FavoritesProvider';

function formatPrice(p: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(p);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

type Tab = 'profil' | 'siparisler' | 'favoriler';

export default function HesapPage() {
  const router = useRouter();
  const { favorites, removeFavorite } = useFavorites();
  const [user, setUserState] = useState<AccountUser | null>(null);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [tab, setTab] = useState<Tab>('profil');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace('/giris');
      return;
    }
    setUserState(u);
    setOrders(getOrders(u.email));
    setReady(true);
  }, [router]);

  function handleLogout() {
    logoutUser();
    router.push('/');
  }

  if (!ready || !user) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = user.name.slice(0, 2).toUpperCase();

  const tabs: { key: Tab; label: string; icon: typeof User; badge?: number }[] = [
    { key: 'profil', label: 'Profil', icon: User },
    { key: 'siparisler', label: 'Siparişlerim', icon: Package, badge: orders.length },
    { key: 'favoriler', label: 'Favorilerim', icon: Heart, badge: favorites.length },
  ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-navy-700 text-white flex items-center justify-center font-serif font-bold text-xl">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-navy-900">Merhaba, {user.name}</h1>
            <p className="text-sm text-charcoal/55 flex items-center gap-1.5"><Mail size={13} /> {user.email}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            {tabs.map(({ key, label, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  tab === key ? 'bg-navy-700 text-white shadow-md' : 'bg-white text-charcoal/70 hover:bg-cream-200 border border-[#EDE9E4]'
                }`}
              >
                <Icon size={17} />
                {label}
                {badge != null && badge > 0 && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${tab === key ? 'bg-white/20' : 'bg-orange-100 text-orange-600'}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 bg-white hover:bg-red-50 border border-[#EDE9E4] transition-colors"
            >
              <LogOut size={17} /> Çıkış Yap
            </button>
          </aside>

          {/* Content */}
          <div className="min-h-[400px]">
            {tab === 'profil' && (
              <div className="bg-white rounded-3xl border border-[#EDE9E4] p-7 shadow-card">
                <h2 className="font-serif text-xl font-bold text-navy-900 mb-6">Hesap Bilgilerim</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Ad Soyad</label>
                    <div className="px-4 py-3 rounded-xl bg-cream border border-[#EDE9E4] text-sm text-charcoal">{user.name}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">E-posta</label>
                    <div className="px-4 py-3 rounded-xl bg-cream border border-[#EDE9E4] text-sm text-charcoal">{user.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="rounded-2xl bg-sage-50 border border-[#EDE9E4] p-5 text-center">
                    <p className="font-serif font-bold text-3xl text-navy-700">{orders.length}</p>
                    <p className="text-xs text-charcoal/55 mt-1">Toplam Sipariş</p>
                  </div>
                  <div className="rounded-2xl bg-red-50 border border-[#EDE9E4] p-5 text-center">
                    <p className="font-serif font-bold text-3xl text-red-500">{favorites.length}</p>
                    <p className="text-xs text-charcoal/55 mt-1">Favori Ürün</p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'siparisler' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#EDE9E4] p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-2xl flex items-center justify-center">
                      <ShoppingBag size={30} className="text-charcoal/35" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-900 mb-2">Henüz Siparişiniz Yok</h3>
                    <p className="text-charcoal/55 text-sm mb-6">İlk siparişinizi vermek için ürünleri inceleyin.</p>
                    <Link href="/urunler" className="btn-orange inline-flex items-center gap-2 px-6 py-3 rounded-2xl">
                      Alışverişe Başla <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  orders.map((o) => (
                    <div key={o.order_number} className="bg-white rounded-2xl border border-[#EDE9E4] p-6">
                      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-4 border-b border-[#EDE9E4]">
                        <div>
                          <p className="font-bold text-navy-900">{o.order_number}</p>
                          <p className="text-xs text-charcoal/50 flex items-center gap-1.5 mt-0.5"><Calendar size={12} /> {formatDate(o.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 mb-1">Beklemede</span>
                          <p className="font-bold text-navy-700">{formatPrice(o.total)}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {o.items.map((it) => (
                          <div key={it.product_id} className="flex justify-between text-sm">
                            <span className="text-charcoal/70 truncate max-w-[70%]">{it.product_name} × {it.quantity}</span>
                            <span className="font-medium text-charcoal">{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'favoriler' && (
              <div>
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#EDE9E4] p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
                      <Heart size={30} className="text-red-300" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-900 mb-2">Favori Listeniz Boş</h3>
                    <p className="text-charcoal/55 text-sm mb-6">Beğendiğiniz ürünleri kalbe dokunarak kaydedin.</p>
                    <Link href="/urunler" className="btn-orange inline-flex items-center gap-2 px-6 py-3 rounded-2xl">
                      Ürünleri Keşfet <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {favorites.map((f) => (
                      <div key={f.id} className="bg-white rounded-2xl border border-[#EDE9E4] p-4 flex gap-4 items-center">
                        <Link href={`/urun/${f.slug}`} className="w-16 h-16 rounded-xl bg-sage-50 flex-shrink-0 overflow-hidden">
                          {f.image && <img src={f.image} alt={f.name} className="w-full h-full object-cover" />}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/urun/${f.slug}`} className="font-semibold text-sm text-charcoal hover:text-navy-700 line-clamp-2 block">{f.name}</Link>
                          <p className="font-bold text-navy-700 text-sm mt-1">{formatPrice(f.price)}</p>
                        </div>
                        <button onClick={() => removeFavorite(f.id)} aria-label="Favorilerden çıkar" className="text-charcoal/30 hover:text-red-500 transition-colors">
                          <Heart size={18} fill="currentColor" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowRight, Shield, Truck, Star, RefreshCcw } from 'lucide-react';
import { getProducts, getStats } from '../lib/db';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import WhyUsSection from '../components/WhyUsSection';
import CtaSection from '../components/CtaSection';
import TestimonialsSection from '../components/TestimonialsSection';

const TRUST_BADGES = [
  { icon: Shield, title: 'Güvenli Ödeme', desc: 'SSL korumalı işlemler' },
  { icon: Truck, title: 'Hızlı Teslimat', desc: 'Türkiye geneli kargo' },
  { icon: Star, title: 'Premium Kalite', desc: 'Detaylı kontrol edilmiş' },
  { icon: RefreshCcw, title: 'Kolay İade', desc: '7 gün içinde iade' },
];

export default async function HomePage() {
  const allProducts = await getProducts();
  const stats = await getStats();
  const featured = allProducts.filter((p) => p.featured && p.stock > 0).slice(0, 4);
  const recent = allProducts.filter((p) => p.stock > 0).slice(0, 8);

  const countBy = (cat: string) => allProducts.filter((p) => p.category === cat && p.stock > 0).length;
  const imgOf = (cat: string) => allProducts.find((p) => p.category === cat && p.image)?.image ?? '/products/1.jpeg';
  const categories = [
    { slug: 'bebek-arabasi', title: 'Bebek Arabaları', desc: 'Stokke, Bugaboo ve daha fazlası — yüksek konfor, üst düzey güvenlik.', count: countBy('bebek-arabasi'), image: imgOf('bebek-arabasi'), emoji: '🍼', glow: 'rgba(180,211,180,0.9)', tint: 'rgba(30,53,86,0.85)' },
    { slug: 'oto-koltuğu', title: 'Oto Koltukları', desc: 'Güvenli yolculuklar için 360° dönen premium modeller.', count: countBy('oto-koltuğu'), image: imgOf('oto-koltuğu'), emoji: '🚗', glow: 'rgba(255,208,184,0.9)', tint: 'rgba(30,53,86,0.82)' },
    { slug: 'aksesuar', title: 'Aksesuarlar', desc: 'Deneyimi tamamlayan özenli detaylar.', count: countBy('aksesuar'), image: imgOf('aksesuar'), emoji: '✨', glow: 'rgba(184,206,255,0.9)', tint: 'rgba(30,53,86,0.82)' },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroSection
        totalProducts={stats.total_products}
        totalOrders={stats.total_orders}
        inStock={stats.in_stock}
      />

      {/* ── Trust Badges ─────────────────────────────────────────────── */}
      <section className="bg-white py-10 border-b border-[#EDE9E4]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-charcoal">{title}</p>
                  <p className="text-xs text-charcoal/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Öne Çıkan</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">Premium Seçimler</h2>
              </div>
              <Link href="/urunler" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-orange-500 transition-colors">
                Tümünü Gör <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Categories ────────────────────────────────────────────────── */}
      <CategorySection categories={categories} />

      {/* ── All Products ───────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Stokta</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">Tüm Ürünler</h2>
            </div>
            <Link href="/urunler" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-orange-500 transition-colors">
              Filtreyle <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/urunler" className="btn-navy inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base">
              Tüm Ürünleri Gör <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────────────────── */}
      <WhyUsSection totalOrders={stats.total_orders} />

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <CtaSection inStock={stats.in_stock} />
    </>
  );
}

import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { SlidersHorizontal, ArrowUpDown, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { value: '', label: 'Tüm Ürünler' },
  { value: 'bebek-arabasi', label: 'Bebek Arabaları' },
  { value: 'oto-koltuğu', label: 'Oto Koltukları' },
  { value: 'aksesuar', label: 'Aksesuarlar' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Varsayılan' },
  { value: 'fiyat-artan', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'fiyat-azalan', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'isim', label: 'İsme Göre' },
];

const PRICE_RANGES = [
  { value: '', label: 'Tüm Fiyatlar' },
  { value: '0-2000', label: '0 – 2.000 ₺' },
  { value: '2000-5000', label: '2.000 – 5.000 ₺' },
  { value: '5000-10000', label: '5.000 – 10.000 ₺' },
  { value: '10000+', label: '10.000 ₺ ve üzeri' },
];

interface SearchParams { kategori?: string; siralama?: string; fiyat?: string; stok?: string; }

function buildHref(base: Record<string, string | undefined>, override: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { ...base, ...override };
  Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
  const s = params.toString();
  return s ? `/urunler?${s}` : '/urunler';
}

export default async function UrunlerPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { kategori = '', siralama = '', fiyat = '', stok = '' } = sp;

  let products = await getProducts();

  if (kategori) products = products.filter((p) => p.category === kategori);
  if (stok === 'var') products = products.filter((p) => p.stock > 0);

  if (fiyat) {
    const [minS, maxS] = fiyat.split('-');
    const min = parseInt(minS) || 0;
    const max = maxS === '+' || maxS === undefined ? Infinity : parseInt(maxS) || Infinity;
    products = products.filter((p) => p.price >= min && p.price <= max);
  }

  if (siralama === 'fiyat-artan') products = [...products].sort((a, b) => a.price - b.price);
  else if (siralama === 'fiyat-azalan') products = [...products].sort((a, b) => b.price - a.price);
  else if (siralama === 'isim') products = [...products].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  const currentSP = { kategori: kategori || undefined, siralama: siralama || undefined, fiyat: fiyat || undefined, stok: stok || undefined };

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#EDE9E4] pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Mağaza</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
                {kategori === 'bebek-arabasi' ? 'Bebek Arabaları'
                  : kategori === 'oto-koltuğu' ? 'Oto Koltukları'
                  : kategori === 'aksesuar' ? 'Aksesuarlar'
                  : 'Tüm Ürünler'}
              </h1>
              <p className="text-charcoal/55 mt-1 text-sm">{products.length} ürün listeleniyor</p>
            </div>

            {/* Sort dropdown (link-based) */}
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpDown size={15} className="text-charcoal/50" />
              <span className="text-charcoal/60 font-medium">Sırala:</span>
              <div className="flex gap-1 flex-wrap">
                {SORT_OPTIONS.map(({ value, label }) => (
                  <Link
                    key={value}
                    href={buildHref(currentSP, { siralama: value || undefined })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      siralama === value
                        ? 'bg-navy-700 text-white'
                        : 'bg-white border border-[#EDE9E4] text-charcoal hover:border-navy-300 hover:text-navy-700'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar Filters ──────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Category Filter */}
              <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5">
                <h3 className="flex items-center gap-2 font-semibold text-sm text-charcoal mb-4">
                  <SlidersHorizontal size={15} className="text-orange-500" />
                  Kategori
                </h3>
                <ul className="space-y-1">
                  {CATEGORIES.map(({ value, label }) => (
                    <li key={value}>
                      <Link
                        href={buildHref(currentSP, { kategori: value || undefined })}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${
                          kategori === value
                            ? 'bg-navy-700 text-white font-semibold'
                            : 'text-charcoal/75 hover:bg-sage-100 hover:text-navy-700'
                        }`}
                      >
                        {label}
                        {kategori === value && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5">
                <h3 className="font-semibold text-sm text-charcoal mb-4">Fiyat Aralığı</h3>
                <ul className="space-y-1">
                  {PRICE_RANGES.map(({ value, label }) => (
                    <li key={value}>
                      <Link
                        href={buildHref(currentSP, { fiyat: value || undefined })}
                        className={`flex w-full px-3 py-2 rounded-xl text-sm transition-all ${
                          fiyat === value
                            ? 'bg-orange-500 text-white font-semibold'
                            : 'text-charcoal/75 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock Filter */}
              <div className="bg-white rounded-2xl border border-[#EDE9E4] p-5">
                <h3 className="font-semibold text-sm text-charcoal mb-4">Stok Durumu</h3>
                <div className="space-y-1">
                  <Link
                    href={buildHref(currentSP, { stok: undefined })}
                    className={`flex w-full px-3 py-2 rounded-xl text-sm transition-all ${
                      stok !== 'var' ? 'bg-navy-700 text-white font-semibold' : 'text-charcoal/75 hover:bg-sage-100'
                    }`}
                  >
                    Hepsi
                  </Link>
                  <Link
                    href={buildHref(currentSP, { stok: 'var' })}
                    className={`flex w-full px-3 py-2 rounded-xl text-sm transition-all ${
                      stok === 'var' ? 'bg-navy-700 text-white font-semibold' : 'text-charcoal/75 hover:bg-sage-100'
                    }`}
                  >
                    Stokta Var
                  </Link>
                </div>
              </div>

              {/* Reset */}
              {(kategori || siralama || fiyat || stok) && (
                <Link
                  href="/urunler"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#EDE9E4] text-sm font-medium text-charcoal/60 hover:border-red-300 hover:text-red-500 transition-all bg-white"
                >
                  Filtreleri Temizle
                </Link>
              )}
            </div>
          </aside>

          {/* ── Mobile Filters (scrollable chips) ────────────────────── */}
          <div className="lg:hidden w-full -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {CATEGORIES.slice(1).map(({ value, label }) => (
                <Link
                  key={value}
                  href={buildHref(currentSP, { kategori: value || undefined })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all border ${
                    kategori === value
                      ? 'bg-navy-700 text-white border-navy-700'
                      : 'bg-white text-charcoal border-[#EDE9E4] hover:border-navy-300'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href={buildHref(currentSP, { stok: stok === 'var' ? undefined : 'var' })}
                className={`px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all border ${
                  stok === 'var'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-charcoal border-[#EDE9E4]'
                }`}
              >
                Stokta Var
              </Link>
            </div>
          </div>

          {/* ── Product Grid ─────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-2xl flex items-center justify-center">
                  <Package size={28} className="text-charcoal/40" />
                </div>
                <h3 className="font-serif font-bold text-xl text-navy-900 mb-2">Ürün bulunamadı</h3>
                <p className="text-charcoal/55 mb-6 text-sm">Bu kriterlere uygun ürün yok. Filtreleri temizleyip tekrar deneyin.</p>
                <Link href="/urunler" className="btn-ghost inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm">
                  Tümünü Göster
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: '#FAF8F4' }}>
      <p className="font-serif font-bold" style={{ fontSize: 96, color: '#163356', lineHeight: 1 }}>404</p>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: '#163356' }}>Sayfa Bulunamadı</h1>
      <p className="max-w-md text-sm" style={{ color: '#8E8E8E' }}>
        Aradığınız sayfa taşınmış, kaldırılmış ya da hiç var olmamış olabilir.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-2xl"
          style={{ background: '#163356' }}
        >
          <ArrowLeft size={16} /> Ana Sayfaya Dön
        </Link>
        <Link
          href="/urunler"
          className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-2xl"
          style={{ border: '2px solid #163356', color: '#163356' }}
        >
          <Search size={16} /> Ürünlere Göz At
        </Link>
      </div>
    </div>
  );
}

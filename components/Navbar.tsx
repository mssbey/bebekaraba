'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Search, User, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from './CartProvider';
import { useFavorites } from './FavoritesProvider';

const NAV_LINKS = [
  { href: '/urunler', label: 'Tüm Ürünler' },
  { href: '/urunler?kategori=bebek-arabasi', label: 'Bebek Arabaları' },
  { href: '/urunler?kategori=oto-koltu%C4%9Fu', label: 'Oto Koltukları' },
  { href: '/urunler?kategori=aksesuar', label: 'Aksesuarlar' },
  { href: '/urunler', label: 'Kampanyalar' },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const { count: favCount, openFavorites } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'navbar-glass shadow-glass' : 'bg-cream-100/80 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-[70px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm bg-white border border-border">
                <Image
                  src="/logo.png"
                  alt="Bebek Arabacınız"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <p className="font-serif font-bold text-[15px] leading-tight text-navy-700 group-hover:text-orange-500 transition-colors">
                  Bebek Arabacınız
                </p>
                <p className="text-[10px] text-charcoal/50 font-medium tracking-wider">
                  PREMİUM İKİNCİ EL
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Ana menü">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3.5 py-2 text-sm font-medium text-charcoal/80 hover:text-navy-700 hover:bg-sage-50 rounded-xl transition-all duration-150"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Link
                href="/urunler"
                aria-label="Ara"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-charcoal/70 hover:text-navy-700 hover:bg-sage-100 transition-all"
              >
                <Search size={19} />
              </Link>

              {/* Wishlist */}
              <button
                onClick={openFavorites}
                aria-label={`Favoriler (${favCount} ürün)`}
                className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-charcoal/70 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Heart size={19} />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
                    {favCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                href="/hesap"
                aria-label="Hesabım"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-charcoal/70 hover:text-navy-700 hover:bg-sage-100 transition-all"
              >
                <User size={19} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                aria-label={`Sepet (${count} ürün)`}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-charcoal/70 hover:text-navy-700 hover:bg-sage-100 transition-all"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
                    {count}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                aria-label={drawerOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-charcoal/70 hover:text-navy-700 hover:bg-sage-100 transition-all ml-1"
              >
                {drawerOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Overlay */}
          <div
            className="drawer-overlay absolute inset-0"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-80 max-w-[90vw] bg-white h-full shadow-2xl animate-slide-in flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-cream-100 border border-border">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <span className="font-serif font-bold text-navy-700">Bebek Arabacınız</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal/50 hover:bg-cream-200 transition-colors"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-charcoal font-medium hover:bg-sage-100 hover:text-navy-700 transition-colors mb-1"
                >
                  {label}
                  <ChevronRight size={16} className="text-charcoal/30" />
                </Link>
              ))}
            </nav>

            {/* Footer actions */}
            <div className="border-t border-border p-4 space-y-2">
              <Link
                href="/hesap"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal font-medium hover:bg-sage-100 transition-colors"
              >
                <User size={18} className="text-charcoal/50" />
                Hesabım
              </Link>
              <button
                onClick={() => { setDrawerOpen(false); openFavorites(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal font-medium hover:bg-sage-100 transition-colors"
              >
                <Heart size={18} className="text-charcoal/50" />
                Favorilerim {favCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{favCount}</span>}
              </button>
              <button
                onClick={() => { setDrawerOpen(false); openCart(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal font-medium hover:bg-sage-100 transition-colors"
              >
                <ShoppingCart size={18} className="text-charcoal/50" />
                Sepetim {count > 0 && <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

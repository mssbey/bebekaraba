import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { FavoritesProvider } from '@/components/FavoritesProvider';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata: Metadata = {
  title: 'Bebek Arabacınız | Premium Bebek Arabaları',
  description: 'Premium ikinci el Stokke bebek arabaları, oto koltukları ve aksesuarlar. Güvenli, kaliteli ve uygun fiyatlı.',
  keywords: 'stokke bebek arabası, ikinci el bebek arabası, cybex oto koltuğu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>
          <FavoritesProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}

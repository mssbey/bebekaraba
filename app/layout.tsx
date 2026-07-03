import type { Metadata } from 'next';
import Script from 'next/script';
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1HX651KWRV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1HX651KWRV');
          `}
        </Script>
      </head>
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

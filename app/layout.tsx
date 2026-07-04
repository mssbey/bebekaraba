import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { FavoritesProvider } from '@/components/FavoritesProvider';
import ConditionalLayout from '@/components/ConditionalLayout';
import { buildMetadata, getSiteUrl } from '@/lib/seo';
import { organizationSchema, websiteSchema } from '@/lib/schema';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-1HX651KWRV';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildMetadata({
    title: 'Bebek Arabacınız | Premium Bebek Arabaları',
    description: 'Premium ikinci el Stokke bebek arabaları, oto koltukları ve aksesuarlar. Güvenli, kaliteli ve uygun fiyatlı.',
    path: '/',
    keywords: ['stokke bebek arabası', 'ikinci el bebek arabası', 'cybex oto koltuğu'],
  }),
  title: {
    default: 'Bebek Arabacınız | Premium Bebek Arabaları',
    template: '%s | Bebek Arabacınız',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemas = [organizationSchema(), websiteSchema()];

  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {schemas.map((schema, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}

        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </head>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <CartProvider>
          <FavoritesProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}

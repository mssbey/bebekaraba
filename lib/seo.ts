/**
 * lib/seo.ts — SEO metadata yardımcıları
 * Domain hardcode edilmez; NEXT_PUBLIC_SITE_URL ya da SITE_URL üzerinden okunur.
 */
import type { Metadata } from 'next';

export const SITE_NAME = 'Bebek Arabacınız';
export const SITE_TAGLINE = 'Premium İkinci El Bebek Arabaları';
export const DEFAULT_LOCALE = 'tr_TR';
const PRODUCTION_SITE_URL = 'https://www.bebekarabaciniz.com';

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : PRODUCTION_SITE_URL);
  return url.replace(/\/+$/, '');
}

export function absoluteUrl(path: string = '/'): string {
  const base = getSiteUrl();
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
  type?: 'website' | 'article';
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  keywords,
  noindex = false,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl('/logo.png');
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

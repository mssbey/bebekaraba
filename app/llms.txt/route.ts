import { getSiteUrl, SITE_NAME } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const base = getSiteUrl();

  const body = `# ${SITE_NAME}

> Premium ikinci el bebek arabaları, oto koltukları ve aksesuarlar satan bir e-ticaret mağazası. Tüm ürünler uzman kontrolünden geçirilmiş, temizlenmiş ve orijinal aksesuarlarıyla satışa sunulmaktadır.

## Marka
- Ad: ${SITE_NAME}
- Konu: Premium ikinci el bebek arabası, oto koltuğu ve bebek arabası aksesuarları
- Dil: Türkçe
- Pazar: Türkiye

## Önemli Sayfalar
- Ana Sayfa: ${base}/
- Tüm Ürünler: ${base}/urunler
- Bebek Arabaları: ${base}/urunler?kategori=bebek-arabasi
- Oto Koltukları: ${base}/urunler?kategori=oto-koltugu
- Aksesuarlar: ${base}/urunler?kategori=aksesuar
- Blog: ${base}/blog

## Ürün Grupları
- Bebek Arabaları (Stokke, Bugaboo ve benzeri markalar)
- Oto Koltukları (360° dönen, ISOFIX uyumlu modeller)
- Aksesuarlar (bardaklık, yağmurluk, çöp kovası vb.)

## Blog Rehberleri
- Bebek arabası alırken nelere dikkat edilmeli: ${base}/blog/bebek-arabasi-alirken-nelere-dikkat-edilmeli
- Travel sistem bebek arabası nedir: ${base}/blog/travel-sistem-bebek-arabasi-nedir
- Kabin boy bebek arabası seçme rehberi: ${base}/blog/kabin-boy-bebek-arabasi-secme-rehberi
- Yeni doğan bebek için hangi bebek arabası seçilmeli: ${base}/blog/yeni-dogan-bebek-icin-hangi-bebek-arabasi-secilmeli
- İkiz bebek arabası alırken dikkat edilmesi gerekenler: ${base}/blog/ikiz-bebek-arabasi-alirken-dikkat-edilmesi-gerekenler
- Bebek arabası temizliği nasıl yapılır: ${base}/blog/bebek-arabasi-temizligi-nasil-yapilir

## İletişim ve Politikalar
- İletişim: WhatsApp ve e-posta üzerinden 7/24 destek
- İade Politikası: Teslimattan itibaren 7 gün içinde iade
- Kargo: Türkiye geneli, 1-3 iş günü teslimat

## Ek Bilgi
Detaylı marka açıklaması ve sık sorulan sorular için: ${base}/llms-full.txt
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

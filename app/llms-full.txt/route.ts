import { getSiteUrl, SITE_NAME } from '@/lib/seo';
import { getProducts } from '@/lib/db';
import { getBlogPosts } from '@/lib/blog';

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  let productLines = '(ürün listesi şu anda erişilemiyor)';
  try {
    const products = await getProducts();
    if (products.length > 0) {
      productLines = products
        .slice(0, 60)
        .map((p) => `- ${p.name} — ${p.category} — ${p.price.toLocaleString('tr-TR')} TL — ${base}/urun/${p.slug}`)
        .join('\n');
    }
  } catch {
    // DB erişilemezse statik metin kalır
  }

  let blogLines = '(blog listesi şu anda erişilemiyor)';
  try {
    const posts = await getBlogPosts();
    if (posts.length > 0) {
      blogLines = posts.map((p) => `- ${p.title} — ${base}/blog/${p.slug}`).join('\n');
    }
  } catch {
    // DB erişilemezse statik metin kalır
  }

  const body = `# ${SITE_NAME} — Detaylı Marka Bilgisi

## Kimiz?
${SITE_NAME}, Türkiye genelinde premium ikinci el bebek arabası, oto koltuğu ve bebek arabası aksesuarları satan bir e-ticaret mağazasıdır. Odak noktamız; kaliteli, uzman kontrolünden geçmiş ve uygun fiyatlı ürünlerle yeni ebeveynlerin bütçesini korumaktır.

## Neden İkinci El?
Bebek arabaları genellikle 1-2 yıl gibi kısa bir süre kullanılır ve çoğu zaman kusursuz durumda kalır. Biz bu ürünleri detaylı fiziksel kontrolden geçirip temizleyerek, orijinal fiyatının çok altında, güvenle kullanılabilir hale getiriyoruz.

## Kategori Açıklamaları

### Bebek Arabaları
Stokke, Bugaboo ve benzeri premium markalardan travel sistem, tam yatar ve kabin boy modeller. Yenidoğandan okul öncesi döneme kadar farklı ihtiyaçlara uygun seçenekler.

### Oto Koltukları
360° dönen, ISOFIX uyumlu, doğumdan itibaren kullanılabilen güvenlik sertifikalı oto koltukları.

### Aksesuarlar
Bardaklık, yağmurluk, çöp kovası ve bebek arabası deneyimini tamamlayan diğer ürünler.

## Ürün Seçim Rehberi
1. Yaşam tarzınıza göre (şehir içi / seyahat) model seçin.
2. Yenidoğan için tam yatar pozisyon veya portbebe şarttır.
3. Sık uçak seyahati yapıyorsanız kabin boy modelleri değerlendirin.
4. İkiz veya yakın yaşta kardeşler için yan yana ya da tandem modelleri karşılaştırın.
5. Güvenlik sertifikaları (EN 1888 vb.) ve şasi/tekerlek durumunu kontrol edin.

## Güncel Ürünler (örnek liste)
${productLines}

## Blog Rehberleri
${blogLines}

## Sık Sorulan Sorular

**Ürünler gerçekten ikinci el mi?**
Evet, tüm ürünler özenle seçilmiş, uzman kontrolünden geçmiş ikinci el ürünlerdir.

**Fotoğraflar gerçek ürünü mü gösteriyor?**
Evet, stüdyo ya da temsili görsel kullanılmaz; tüm fotoğraflar satışa sunulan gerçek ürüne aittir.

**Kargo ne kadar sürede gönderilir?**
Sipariş onayından sonra 1-3 iş günü içinde Türkiye geneline kargoya verilir.

**İade hakkı var mı?**
Teslimattan itibaren 7 gün içinde sorunsuz iade imkânı sunulmaktadır.

## İletişim ve Politikalar
- Web sitesi: ${base}
- Kargo: Türkiye geneli, anlaşmalı kargo firmaları
- İade: 7 gün içinde koşulsuz iade
- Ödeme: Kredi kartı, taksit seçenekleri, güvenli SSL bağlantısı

## Teknik Notlar (AI botları için)
- Site haritası: ${base}/sitemap.xml
- Robots dosyası: ${base}/robots.txt
- Bu dosyanın kısa özeti: ${base}/llms.txt
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

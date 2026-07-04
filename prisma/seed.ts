import { PrismaClient, Condition, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { blogSeedData } from './blog-seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed başlıyor...');

  // ── Admin kullanıcısı ──────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bebekarabaciniz.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@bebekarabaciniz.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin kullanıcısı:', admin.email);

  // ── Kategoriler ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'bebek-arabasi' },
      update: {},
      create: { name: 'Bebek Arabaları', slug: 'bebek-arabasi', description: 'Premium bebek arabaları', icon: '🍼', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'oto-koltugu' },
      update: {},
      create: { name: 'Oto Koltukları', slug: 'oto-koltugu', description: 'Güvenli oto koltukları', icon: '🚗', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'aksesuar' },
      update: {},
      create: { name: 'Aksesuarlar', slug: 'aksesuar', description: 'Bebek arabası aksesuarları', icon: '✨', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'travel-sistem' },
      update: {},
      create: { name: 'Travel Sistem', slug: 'travel-sistem', description: 'Seyahat sistemleri', icon: '✈️', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'ikiz-araba' },
      update: {},
      create: { name: 'İkiz Bebek Arabası', slug: 'ikiz-araba', description: 'İkiz bebek arabaları', icon: '👶👶', sortOrder: 5 },
    }),
  ]);

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log('✅ Kategoriler:', categories.map((c) => c.name).join(', '));

  // ── Ürünler ────────────────────────────────────────────────────────────────
  const productData = [
    {
      name: 'Stokke Travel Sistem',
      slug: 'stokke-travel-sistem',
      description: 'Yeni doğan bebeğiniz için ideal başlangıç seti. Portbebe ve şasi bir arada, ergonomik tasarım ve yüksek güvenlik standartları. Az kullanılmış, temiz ve bakımlı durumda. Doğumdan 9 kg\'a kadar kullanım.',
      price: 17500,
      stock: 1,
      categoryId: catMap['bebek-arabasi'],
      brand: 'Stokke',
      condition: 'VERY_GOOD' as Condition,
      featured: true,
      gradient: 'grad-blue',
      sortOrder: 1,
      image: '/products/1.jpeg',
    },
    {
      name: 'Stokke v5 + Cybex Aton G Oto Koltuğu',
      slug: 'stokke-v5-cybex-aton-g',
      description: 'Stokke Xplory v5 bebek arabası ve Cybex Aton G 360° dönen oto koltuğunun eşsiz kombinasyonu. Hem araçta hem de sokakta maksimum güvenlik ve konfor.',
      price: 23000,
      stock: 1,
      categoryId: catMap['bebek-arabasi'],
      brand: 'Stokke',
      condition: 'VERY_GOOD' as Condition,
      featured: true,
      gradient: 'grad-indigo',
      sortOrder: 2,
      image: '/products/2.jpeg',
    },
    {
      name: 'Stokke Portbebeli Set',
      slug: 'stokke-portbebeli-set-1',
      description: 'Stokke bebek arabası portbebe adaptörü ve portbebe dahil tam set. Yenidoğandan 6 aya kadar ideal kullanım.',
      price: 17500,
      stock: 1,
      categoryId: catMap['bebek-arabasi'],
      brand: 'Stokke',
      condition: 'GOOD' as Condition,
      featured: true,
      gradient: 'grad-purple',
      sortOrder: 3,
      image: '/products/3.jpeg',
    },
    {
      name: 'Stokke Portbebeli Set (Krem)',
      slug: 'stokke-portbebeli-set-krem',
      description: 'Krem rengi kumaşıyla zarif Stokke portbebeli set. Yenidoğan ile birlikte dolaşmak için ergonomik tasarım.',
      price: 17500,
      stock: 1,
      categoryId: catMap['bebek-arabasi'],
      brand: 'Stokke',
      condition: 'VERY_GOOD' as Condition,
      featured: false,
      gradient: 'grad-pink',
      sortOrder: 4,
      image: '/products/1.jpeg',
    },
    {
      name: 'Stokke Bebek Arabası',
      slug: 'stokke-bebek-arabasi',
      description: 'Klasik Stokke bebek arabası. Dayanıklı alüminyum çerçeve ve premium kumaş döşeme. Yenidoğandan 3 yaşa kadar kullanım.',
      price: 16000,
      stock: 1,
      categoryId: catMap['bebek-arabasi'],
      brand: 'Stokke',
      condition: 'GOOD' as Condition,
      featured: true,
      gradient: 'grad-teal',
      sortOrder: 5,
      image: '/products/2.jpeg',
    },
    {
      name: 'Cybex Aton G 360° Dönen Oto Koltuğu',
      slug: 'cybex-aton-g-360',
      description: '360 derece dönen yenilikçi Cybex Aton G oto koltuğu. Doğumdan 13 kg\'a kadar ideal güvenlik.',
      price: 11000,
      stock: 1,
      categoryId: catMap['oto-koltugu'],
      brand: 'Cybex',
      condition: 'VERY_GOOD' as Condition,
      featured: true,
      campaign: true,
      gradient: 'grad-orange',
      sortOrder: 6,
      image: '/products/3.jpeg',
    },
    {
      name: 'Stokke Besafe izi Sleep Oto Koltuğu',
      slug: 'stokke-besafe-izi-sleep',
      description: 'Besafe izi Sleep tam yatan oto koltuğu. Uzun yolculuklarda bebeğiniz rahatça uyuyabilir.',
      price: 7500,
      stock: 1,
      categoryId: catMap['oto-koltugu'],
      brand: 'Stokke',
      condition: 'GOOD' as Condition,
      featured: false,
      gradient: 'grad-teal',
      sortOrder: 7,
      image: '/products/1.jpeg',
    },
    {
      name: 'Korbell Bebek Bezi Çöp Kovası',
      slug: 'korbell-cop-kovasi',
      description: 'Kötü kokuları kilitleyen Korbell bebek bezi çöp kovası. Özel koku engelleme sistemi.',
      price: 999,
      stock: 3,
      categoryId: catMap['aksesuar'],
      brand: 'Korbell',
      condition: 'NEW_LIKE' as Condition,
      featured: false,
      gradient: 'grad-pink',
      sortOrder: 8,
      image: '/products/2.jpeg',
    },
    {
      name: 'Stokke Bardaklık',
      slug: 'stokke-bardaklik',
      description: 'Stokke bebek arabası için özel tasarım bardaklık. 360° döner, kolay monte edilir.',
      price: 1850,
      stock: 5,
      categoryId: catMap['aksesuar'],
      brand: 'Stokke',
      condition: 'NEW_LIKE' as Condition,
      featured: false,
      gradient: 'grad-green',
      sortOrder: 9,
      image: '/products/3.jpeg',
    },
    {
      name: 'Stokke Xplory Yağmurluk',
      slug: 'stokke-xplory-yagmurluk',
      description: 'Stokke Xplory için üretilmiş şeffaf yağmurluk. PVC içermeyen güvenli malzeme.',
      price: 1750,
      stock: 4,
      categoryId: catMap['aksesuar'],
      brand: 'Stokke',
      condition: 'NEW_LIKE' as Condition,
      featured: false,
      gradient: 'grad-blue',
      sortOrder: 10,
      image: '/products/1.jpeg',
    },
  ];

  const products = [];
  for (const data of productData) {
    const p = await prisma.product.upsert({
      where: { slug: data.slug },
      update: { price: data.price, stock: data.stock },
      create: data,
    });
    products.push(p);
  }
  console.log('✅ Ürünler:', products.length, 'adet eklendi');

  // ── Örnek Müşteriler ───────────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'ayse.yilmaz@gmail.com' },
      update: {},
      create: {
        name: 'Ayşe Yılmaz',
        email: 'ayse.yilmaz@gmail.com',
        phone: '0532 123 45 67',
        city: 'İstanbul',
        tags: ['VIP', 'Tekrar Müşteri'],
      },
    }),
    prisma.customer.upsert({
      where: { email: 'mehmet.kaya@gmail.com' },
      update: {},
      create: {
        name: 'Mehmet Kaya',
        email: 'mehmet.kaya@gmail.com',
        phone: '0541 987 65 43',
        city: 'Ankara',
        tags: ['Yeni'],
      },
    }),
    prisma.customer.upsert({
      where: { email: 'zeynep.demir@hotmail.com' },
      update: {},
      create: {
        name: 'Zeynep Demir',
        email: 'zeynep.demir@hotmail.com',
        phone: '0555 234 56 78',
        city: 'İzmir',
        tags: [],
      },
    }),
  ]);
  console.log('✅ Müşteriler:', customers.length, 'adet eklendi');

  // ── Örnek Siparişler ───────────────────────────────────────────────────────
  const orderStatuses: OrderStatus[] = ['DELIVERED', 'SHIPPED', 'PREPARING', 'PENDING', 'CANCELLED'];
  const sampleOrders = [
    {
      orderNumber: 'BA-20260101-1001',
      customerId: customers[0].id,
      address: 'Bağcılar Mah. Gül Sok. No:5 D:12',
      city: 'İstanbul',
      total: 17500,
      shipping: 0,
      status: 'DELIVERED' as OrderStatus,
      items: [{ productId: products[0].id, name: products[0].name, price: products[0].price, quantity: 1 }],
    },
    {
      orderNumber: 'BA-20260210-1002',
      customerId: customers[1].id,
      address: 'Çankaya Mah. Atatürk Cad. No:22',
      city: 'Ankara',
      total: 23000,
      shipping: 0,
      status: 'SHIPPED' as OrderStatus,
      items: [{ productId: products[1].id, name: products[1].name, price: products[1].price, quantity: 1 }],
    },
    {
      orderNumber: 'BA-20260315-1003',
      customerId: customers[2].id,
      address: 'Karşıyaka Mah. Özgürlük Cad. No:8',
      city: 'İzmir',
      total: 12849,
      shipping: 0,
      status: 'PREPARING' as OrderStatus,
      items: [
        { productId: products[5].id, name: products[5].name, price: products[5].price, quantity: 1 },
        { productId: products[7].id, name: products[7].name, price: products[7].price, quantity: 1 },
      ],
    },
    {
      orderNumber: 'BA-20260420-1004',
      guestName: 'Fatma Çelik',
      guestEmail: 'fatma@example.com',
      guestPhone: '0544 111 22 33',
      address: 'Nilüfer Mah. Atatürk Blv. No:44',
      city: 'Bursa',
      total: 16000,
      shipping: 0,
      status: 'PENDING' as OrderStatus,
      items: [{ productId: products[4].id, name: products[4].name, price: products[4].price, quantity: 1 }],
    },
    {
      orderNumber: 'BA-20260530-1005',
      customerId: customers[0].id,
      address: 'Bağcılar Mah. Gül Sok. No:5 D:12',
      city: 'İstanbul',
      total: 19350,
      shipping: 0,
      status: 'PENDING' as OrderStatus,
      items: [
        { productId: products[6].id, name: products[6].name, price: products[6].price, quantity: 1 },
        { productId: products[8].id, name: products[8].name, price: products[8].price, quantity: 1 },
      ],
    },
  ];

  for (const orderData of sampleOrders) {
    const exists = await prisma.order.findUnique({ where: { orderNumber: orderData.orderNumber } });
    if (!exists) {
      const { items, ...rest } = orderData;
      await prisma.order.create({
        data: {
          ...rest,
          items: { create: items },
        },
      });
    }
  }
  console.log('✅ Siparişler:', sampleOrders.length, 'adet eklendi');

  // ── Site Ayarları ──────────────────────────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'Bebek Arabacınız' },
    { key: 'site_description', value: 'Premium İkinci El Bebek Arabaları' },
    { key: 'whatsapp_number', value: '+905321234567' },
    { key: 'email', value: 'info@bebekarabaciniz.com' },
    { key: 'instagram', value: 'https://instagram.com/bebekarabaciniz' },
    { key: 'facebook', value: '' },
    { key: 'hero_title', value: 'Premium Bebek Arabaları' },
    { key: 'hero_subtitle', value: 'Her bebek için en iyi başlangıç' },
    { key: 'shipping_threshold', value: '500' },
    { key: 'shipping_price', value: '150' },
    { key: 'footer_text', value: '© 2026 Bebek Arabacınız · Tüm hakları saklıdır' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Ayarlar: eklendi');

  // ── Blog Yazıları ──────────────────────────────────────────────────────────
  for (const post of blogSeedData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags,
        featured: post.featured,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        faq: post.faq,
        sortOrder: post.sortOrder,
        published: true,
      },
    });
  }
  console.log('✅ Blog yazıları:', blogSeedData.length, 'adet eklendi');

  console.log('\n🎉 Seed tamamlandı!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Admin:    admin@bebekarabaciniz.com');
  console.log('🔑 Şifre:    123456');
  console.log('🌐 Admin:    http://localhost:3000/admin');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

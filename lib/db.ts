import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// ── Types ──────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  featured: number;
  gradient: string;
  sort_order: number;
  created_at: string;
  image?: string;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  city: string;
  notes: string;
  total: number;
  status: string;
  items: OrderItem[];
  created_at: string;
}

interface Store {
  products: Product[];
  orders: Order[];
  nextOrderId: number;
  nextProductId: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStore(): Store {
  ensureDir();
  try {
    return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) as Store;
  } catch {
    const store = createInitialStore();
    saveStore(store);
    return store;
  }
}

function saveStore(store: Store): void {
  ensureDir();
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  return loadStore().products.sort((a, b) => a.sort_order - b.sort_order);
}

export function getProduct(idOrSlug: string | number): Product | null {
  const store = loadStore();
  if (typeof idOrSlug === 'number' || /^\d+$/.test(String(idOrSlug))) {
    return store.products.find(p => p.id === Number(idOrSlug)) ?? null;
  }
  return store.products.find(p => p.slug === idOrSlug) ?? null;
}

export function updateProduct(id: number, data: Partial<Product>): Product | null {
  const store = loadStore();
  const idx = store.products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const allowed: (keyof Product)[] = ['name', 'slug', 'description', 'price', 'stock', 'category', 'brand', 'featured', 'gradient', 'image', 'sort_order'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.products[idx] as any)[key] = data[key];
    }
  }
  saveStore(store);
  return store.products[idx];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createProduct(data: Partial<Product>): Product {
  const store = loadStore();
  const now = new Date().toISOString();
  const baseSlug = data.slug?.trim() || slugify(data.name || 'urun');
  let slug = baseSlug || 'urun';
  let n = 2;
  while (store.products.some(p => p.slug === slug)) {
    slug = `${baseSlug}-${n++}`;
  }
  const maxSort = store.products.reduce((m, p) => Math.max(m, p.sort_order), 0);
  const product: Product = {
    id: store.nextProductId++,
    name: data.name?.trim() || 'İsimsiz Ürün',
    slug,
    description: data.description || '',
    price: data.price ?? 0,
    stock: data.stock ?? 1,
    category: data.category || 'bebek-arabasi',
    brand: data.brand || 'Stokke',
    featured: data.featured ?? 0,
    gradient: data.gradient || 'grad-blue',
    sort_order: data.sort_order ?? maxSort + 1,
    created_at: now,
    image: data.image,
  };
  store.products.push(product);
  saveStore(store);
  return product;
}

export function deleteProduct(id: number): boolean {
  const store = loadStore();
  const idx = store.products.findIndex(p => p.id === id);
  if (idx === -1) return false;
  store.products.splice(idx, 1);
  saveStore(store);
  return true;
}

export interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  city: string;
  notes: string;
  items: OrderItem[];
  total: number;
}

export function createOrder(data: CreateOrderData): string {
  const store = loadStore();

  // Verify and decrement stock
  for (const item of data.items) {
    const product = store.products.find(p => p.id === item.product_id);
    if (!product || product.stock < item.quantity) {
      throw new Error(`"${item.product_name}" için yeterli stok yok.`);
    }
  }

  // Decrement stock
  for (const item of data.items) {
    const product = store.products.find(p => p.id === item.product_id)!;
    product.stock = Math.max(0, product.stock - item.quantity);
  }

  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  const order_number = `BA-${ymd}-${rand}`;

  const order: Order = {
    id: store.nextOrderId++,
    order_number,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone || '',
    customer_address: data.customer_address,
    city: data.city || '',
    notes: data.notes || '',
    total: data.total,
    status: 'beklemede',
    items: data.items,
    created_at: now.toISOString(),
  };

  store.orders.unshift(order);
  saveStore(store);
  return order_number;
}

export function getOrders(): Order[] {
  return loadStore().orders;
}

export function updateOrderStatus(id: number, status: string): void {
  const store = loadStore();
  const order = store.orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    saveStore(store);
  }
}

export function getStats() {
  const store = loadStore();
  const total_products = store.products.length;
  const in_stock = store.products.filter(p => p.stock > 0).length;
  const sold = total_products - in_stock;
  const total_orders = store.orders.length;
  const total_revenue = store.orders.reduce((s, o) => s + o.total, 0);
  const pending_orders = store.orders.filter(o => o.status === 'beklemede').length;
  return { total_products, in_stock, sold, total_orders, total_revenue, pending_orders };
}

// ── Seed Data ──────────────────────────────────────────────────────────────

function createInitialStore(): Store {
  const now = new Date().toISOString();
  const products: Product[] = SEED_PRODUCTS.map((p, i) => ({
    ...p,
    id: i + 1,
    stock: 1,
    brand: p.brand ?? 'Stokke',
    created_at: now,
  }));

  return {
    products,
    orders: [],
    nextOrderId: 1,
    nextProductId: products.length + 1,
  };
}

interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  featured: number;
  gradient: string;
  sort_order: number;
}

const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'Stokke Travel Sistem',
    slug: 'stokke-travel-sistem',
    description: 'Yeni doğan bebeğiniz için ideal başlangıç seti. Portbebe ve şasi bir arada, ergonomik tasarım ve yüksek güvenlik standartları. Az kullanılmış, temiz ve bakımlı durumda. Doğumdan 9 kg\'a kadar kullanım.',
    price: 17500,
    category: 'bebek-arabasi',
    featured: 1,
    gradient: 'grad-blue',
    sort_order: 1,
  },
  {
    name: 'Stokke v5 + Cybex Aton G Oto Koltuğu',
    slug: 'stokke-v5-cybex-aton-g',
    description: 'Stokke Xplory v5 bebek arabası ve Cybex Aton G 360° dönen oto koltuğunun eşsiz kombinasyonu. Hem araçta hem de sokakta maksimum güvenlik ve konfor. Tam set, mükemmel durumda.',
    price: 23000,
    category: 'bebek-arabasi',
    featured: 1,
    gradient: 'grad-indigo',
    sort_order: 2,
  },
  {
    name: 'Stokke Portbebeli Set',
    slug: 'stokke-portbebeli-set-1',
    description: 'Stokke bebek arabası portbebe adaptörü ve portbebe dahil tam set. Yenidoğandan 6 aya kadar ideal kullanım. Bebeğinizi size yakın tutarken özgürce dolaşın.',
    price: 17500,
    category: 'bebek-arabasi',
    featured: 1,
    gradient: 'grad-purple',
    sort_order: 3,
  },
  {
    name: 'Stokke Portbebeli Set (Krem)',
    slug: 'stokke-portbebeli-set-krem',
    description: 'Krem rengi kumaşıyla zarif Stokke portbebeli set. Yenidoğan ile birlikte dolaşmak için ergonomik tasarım. Kumaşlar yıkanmış ve temiz.',
    price: 17500,
    category: 'bebek-arabasi',
    featured: 0,
    gradient: 'grad-pink',
    sort_order: 4,
  },
  {
    name: 'Siyah Stokke Portbebeli Set',
    slug: 'siyah-stokke-portbebeli-set',
    description: 'Şık siyah renk seçeneğiyle Stokke bebek arabası portbebe seti. Modern ve zarif görünüm, sağlam alüminyum şasi. Her yerde dikkat çekici tasarım.',
    price: 17500,
    category: 'bebek-arabasi',
    featured: 0,
    gradient: 'grad-dark',
    sort_order: 5,
  },
  {
    name: 'Stokke Bebek Arabası',
    slug: 'stokke-bebek-arabasi',
    description: 'Klasik Stokke bebek arabası. Dayanıklı alüminyum çerçeve ve premium kumaş döşeme. Yenidoğandan 3 yaşa kadar kullanım. Yüksek konumlu oturma pozisyonu ile bebeğiniz trafikten uzakta.',
    price: 16000,
    category: 'bebek-arabasi',
    featured: 1,
    gradient: 'grad-teal',
    sort_order: 6,
  },
  {
    name: 'Stokke Travel Sistem Bebek Arabası',
    slug: 'stokke-travel-sistem-bebek-arabasi',
    description: 'Komple Stokke Travel Sistem bebek arabası. Portbebe adaptörü ile yenidoğandan itibaren kullanılabilir. Hava limanı dostu, katlanabilir şasi. Pratik ve konforlu.',
    price: 18000,
    category: 'bebek-arabasi',
    featured: 0,
    gradient: 'grad-blue',
    sort_order: 7,
  },
  {
    name: 'Lacivert Stokke Bebek Arabası',
    slug: 'lacivert-stokke-bebek-arabasi',
    description: 'Zarif lacivert rengiyle Stokke bebek arabası. Kaliteli malzeme ve uzun ömürlü tasarım. Yüksek konumlu oturma, ayarlanabilir sırtlık ve geniş alışveriş sepeti.',
    price: 17000,
    category: 'bebek-arabasi',
    featured: 0,
    gradient: 'grad-navy',
    sort_order: 8,
  },
  {
    name: 'Stokke Full Set',
    slug: 'stokke-full-set',
    description: 'Her şeyin dahil olduğu Stokke Full Set! Şasi, oturak, portbebe adaptörü ve yağmurluk bir arada. Hepsini ayrı ayrı almak yerine tam seti alın, çok daha ekonomik.',
    price: 21000,
    category: 'bebek-arabasi',
    featured: 1,
    gradient: 'grad-green',
    sort_order: 9,
  },
  {
    name: 'Stokke v5 Full Full Set',
    slug: 'stokke-v5-full-full-set',
    description: 'Stokke Xplory v5 tüm aksesuarlarıyla eksiksiz set. Şasi, oturak, portbebe, bardaklık, sineklik ve yağmurluk dahil. En kapsamlı Stokke paketi, mükemmel durumda.',
    price: 22000,
    category: 'bebek-arabasi',
    featured: 1,
    gradient: 'grad-indigo',
    sort_order: 10,
  },
  {
    name: 'Stokke Xplory Yenidoğan Modüllü',
    slug: 'stokke-xplory-yenidogan',
    description: 'Stokke Xplory\'nin yenidoğan modülüyle donatılmış özel versiyonu. Bebeğiniz doğumdan itibaren ebeveynine yakın, güvende. Yüksek konumlu tasarım sayesinde göz teması kesintisiz.',
    price: 19800,
    category: 'bebek-arabasi',
    featured: 1,
    gradient: 'grad-purple',
    sort_order: 11,
  },
  {
    name: 'Cybex Aton G 360° Dönen Oto Koltuğu',
    slug: 'cybex-aton-g-360',
    description: '360 derece dönen yenilikçi Cybex Aton G oto koltuğu. Bebeğinizi kolayca takıp çıkarın, hem yüze karşı hem yüze doğru kullanım. Doğumdan 13 kg\'a kadar ideal güvenlik.',
    price: 11000,
    category: 'oto-koltuğu',
    brand: 'Cybex',
    featured: 1,
    gradient: 'grad-orange',
    sort_order: 12,
  },
  {
    name: 'Stokke Besafe izi Sleep Oto Koltuğu',
    slug: 'stokke-besafe-izi-sleep',
    description: 'Besafe izi Sleep tam yatan oto koltuğu. Bebeğinizin uzun yolculuklarda rahatça uyuyabileceği özel tasarım. Yatar pozisyon, ekstra koruma ve premium kumaş.',
    price: 7500,
    category: 'oto-koltuğu',
    featured: 0,
    gradient: 'grad-teal',
    sort_order: 13,
  },
  {
    name: 'Korbell Bebek Bezi Çöp Kovası',
    slug: 'korbell-cop-kovasi',
    description: 'Kötü kokuları kilitleyen Korbell bebek bezi çöp kovası. Özel koku engelleme sistemiyle bebek odanızı her zaman taze tutar. Kolay kullanım, büyük kapasite.',
    price: 999,
    category: 'aksesuar',
    brand: 'Korbell',
    featured: 0,
    gradient: 'grad-pink',
    sort_order: 14,
  },
  {
    name: 'Stokke Bardaklık',
    slug: 'stokke-bardaklik',
    description: 'Stokke bebek arabası için özel tasarım bardaklık. Şasi üzerine kolayca monte edilir, 360° döner. Hem ebeveyn hem çocuk bardakları için ideal boyut.',
    price: 1850,
    category: 'aksesuar',
    featured: 0,
    gradient: 'grad-green',
    sort_order: 15,
  },
  {
    name: 'Stokke Sineklik',
    slug: 'stokke-sineklik',
    description: 'Stokke bebek arabası için tasarlanmış kaliteli sineklik. Çok ince file yapısı ile hava sirkülasyonunu bozmadan bebeğinizi böceklerden korur. Kolay takılıp çıkarılır.',
    price: 999,
    category: 'aksesuar',
    featured: 0,
    gradient: 'grad-navy',
    sort_order: 16,
  },
  {
    name: 'Stokke Xplory Yağmurluk',
    slug: 'stokke-xplory-yagmurluk',
    description: 'Stokke Xplory için üretilmiş şeffaf yağmurluk. Bebeğinizi her hava koşulunda korur. PVC içermeyen güvenli malzeme. Katlanabilir ve taşınabilir.',
    price: 1750,
    category: 'aksesuar',
    featured: 0,
    gradient: 'grad-blue',
    sort_order: 17,
  },
];

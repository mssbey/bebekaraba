/**
 * lib/db.ts — Prisma-backed data layer
 * Dışa açık arayüz eski JSON sürümüyle uyumlu tutuldu,
 * iç işlem Prisma üzerinden PostgreSQL'e gidiyor.
 */
import { prisma } from './prisma';
import type { Condition, OrderStatus } from '@prisma/client';

// ── Tipler ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  category: string;   // slug for backward compat
  categoryId: string;
  brand: string;
  model?: string;
  condition: string;
  featured: boolean;
  campaign: boolean;
  gradient: string;
  sort_order: number;
  image?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
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

// ── Ürün işlemleri ────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return rows.map(toProduct);
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: { category: true },
  });
  return row ? toProduct(row) : null;
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const baseSlug = data.slug?.trim() || slugify(data.name || 'urun');
  let slug = baseSlug;
  let n = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const catId = data.categoryId || (await defaultCategoryId(data.category));

  const row = await prisma.product.create({
    data: {
      name: data.name || 'İsimsiz Ürün',
      slug,
      description: data.description || '',
      price: data.price || 0,
      salePrice: data.salePrice ?? null,
      stock: data.stock ?? 1,
      categoryId: catId,
      brand: data.brand || '',
      model: data.model,
      condition: (data.condition as Condition) || 'VERY_GOOD',
      featured: data.featured ?? false,
      campaign: data.campaign ?? false,
      gradient: data.gradient || 'grad-blue',
      sortOrder: data.sort_order ?? 0,
      image: data.image ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
    },
    include: { category: true },
  });
  return toProduct(row);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const update: Record<string, unknown> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.slug !== undefined) update.slug = data.slug;
  if (data.description !== undefined) update.description = data.description;
  if (data.price !== undefined) update.price = data.price;
  if (data.salePrice !== undefined) update.salePrice = data.salePrice;
  if (data.stock !== undefined) update.stock = data.stock;
  if (data.brand !== undefined) update.brand = data.brand;
  if (data.model !== undefined) update.model = data.model;
  if (data.condition !== undefined) update.condition = data.condition as Condition;
  if (data.featured !== undefined) update.featured = data.featured;
  if (data.campaign !== undefined) update.campaign = data.campaign;
  if (data.gradient !== undefined) update.gradient = data.gradient;
  if (data.sort_order !== undefined) update.sortOrder = data.sort_order;
  if (data.image !== undefined) update.image = data.image;
  if (data.categoryId !== undefined) update.categoryId = data.categoryId;
  if (data.seoTitle !== undefined) update.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) update.seoDescription = data.seoDescription;

  const row = await prisma.product.update({
    where: { id },
    data: update,
    include: { category: true },
  });
  return toProduct(row);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await prisma.product.delete({ where: { id } });
  return true;
}

// ── Sipariş işlemleri ─────────────────────────────────────────────────────────
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

export async function createOrder(data: CreateOrderData): Promise<string> {
  // Stok kontrolü
  for (const item of data.items) {
    const p = await prisma.product.findUnique({ where: { id: item.product_id } });
    if (!p || p.stock < item.quantity) {
      throw new Error(`"${item.product_name}" için yeterli stok yok.`);
    }
  }

  // Stok düşür
  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.product_id },
      data: { stock: { decrement: item.quantity } },
    });
  }

  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  const orderNumber = `BA-${ymd}-${rand}`;

  // Müşteri bul veya oluştur
  let customerId: string | null = null;
  if (data.customer_email) {
    const customer = await prisma.customer.upsert({
      where: { email: data.customer_email },
      update: { name: data.customer_name, phone: data.customer_phone || undefined, city: data.city },
      create: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone || undefined,
        city: data.city,
      },
    });
    customerId = customer.id;
  }

  await prisma.order.create({
    data: {
      orderNumber,
      customerId,
      guestName: customerId ? null : data.customer_name,
      guestEmail: customerId ? null : data.customer_email,
      guestPhone: customerId ? null : data.customer_phone,
      address: data.customer_address,
      city: data.city,
      notes: data.notes || null,
      total: data.total,
      status: 'PENDING',
      items: {
        create: data.items.map((i) => ({
          productId: i.product_id,
          name: i.product_name,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    },
  });

  return orderNumber;
}

export async function getOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true, customer: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toOrder);
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
  });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export async function getStats() {
  const [total_products, in_stock, total_orders, revenue, pending_orders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stock: { gt: 0 } } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    total_products,
    in_stock,
    sold: total_products - in_stock,
    total_orders,
    total_revenue: revenue._sum.total ?? 0,
    pending_orders,
  };
}

// ── Dönüştürücüler ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    price: row.price,
    salePrice: row.salePrice,
    stock: row.stock,
    category: row.category?.slug || '',
    categoryId: row.categoryId,
    brand: row.brand || '',
    model: row.model,
    condition: row.condition,
    featured: row.featured,
    campaign: row.campaign,
    gradient: row.gradient || 'grad-blue',
    sort_order: row.sortOrder,
    image: row.image ?? undefined,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    created_at: row.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toOrder(row: any): Order {
  const name = row.customer?.name || row.guestName || 'Misafir';
  const email = row.customer?.email || row.guestEmail || '';
  const phone = row.customer?.phone || row.guestPhone || '';
  return {
    id: row.id,
    order_number: row.orderNumber,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    customer_address: row.address,
    city: row.city,
    notes: row.notes || '',
    total: row.total,
    status: row.status,
    items: (row.items || []).map((i: { productId: string; name: string; price: number; quantity: number }) => ({
      product_id: i.productId,
      product_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    created_at: row.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function defaultCategoryId(slug?: string): Promise<string> {
  const target = slug || 'bebek-arabasi';
  const cat = await prisma.category.findFirst({ where: { slug: target } });
  if (cat) return cat.id;
  const first = await prisma.category.findFirst({ orderBy: { sortOrder: 'asc' } });
  if (first) return first.id;
  throw new Error('Hiç kategori bulunamadı. Önce `npm run db:seed` çalıştırın.');
}

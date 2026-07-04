import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalProducts,
    inStock,
    totalOrders,
    totalCustomers,
    revenueAll,
    revenueThisMonth,
    revenueLastMonth,
    ordersThisMonth,
    ordersLastMonth,
    pendingOrders,
    recentOrders,
    lowStock,
    ordersByStatus,
    // Aylık satış trendi (son 6 ay)
    monthlyRevenue,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stock: { gt: 0 } } }),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true, items: { take: 1 } },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 2, gt: 0 } },
      orderBy: { stock: 'asc' },
      take: 5,
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
        COALESCE(SUM(total), 0)::float as revenue
      FROM orders
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC
    `,
  ]);

  const revenueGrowth =
    revenueLastMonth._sum.total && revenueLastMonth._sum.total > 0
      ? (((revenueThisMonth._sum.total ?? 0) - revenueLastMonth._sum.total) / revenueLastMonth._sum.total) * 100
      : 0;

  const orderGrowth =
    ordersLastMonth > 0
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100
      : 0;

  return NextResponse.json({
    totalProducts,
    inStock,
    outOfStock: totalProducts - inStock,
    totalOrders,
    totalCustomers,
    totalRevenue: revenueAll._sum.total ?? 0,
    revenueThisMonth: revenueThisMonth._sum.total ?? 0,
    revenueGrowth: Math.round(revenueGrowth),
    ordersThisMonth,
    orderGrowth: Math.round(orderGrowth),
    pendingOrders,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer?.name || o.guestName || 'Misafir',
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      itemCount: o.items.length,
    })),
    lowStock: lowStock.map((p) => ({ id: p.id, name: p.name, stock: p.stock, image: p.image })),
    ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
    monthlyRevenue,
  });
}

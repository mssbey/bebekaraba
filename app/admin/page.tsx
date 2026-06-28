import { getStats, getOrders, getProducts } from '@/lib/db';
import DashboardClient from '@/components/admin/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const orders = await getOrders();
  const products = await getProducts();

  return <DashboardClient stats={stats} orders={orders} products={products} />;
}

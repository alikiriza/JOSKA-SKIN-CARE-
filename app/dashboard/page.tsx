import { Suspense } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function AnalyticsCards() {
  let totalUsers = 0, totalProducts = 0, totalOrders = 0, totalRevenue = 0;
  try {
    const [u, p, o, r] = await Promise.all([
      db.user.count(),
      db.product.count({ where: { isActive: true } }),
      db.order.count(),
      db.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    ]);
    totalUsers = u;
    totalProducts = p;
    totalOrders = o;
    totalRevenue = r._sum.total ? Number(r._sum.total) : 0;
  } catch {}

  const cards = [
    { label: "Total Revenue", value: `UGX ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-sage-600 bg-sage-50" },
    { label: "Total Orders", value: String(totalOrders), icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
    { label: "Active Products", value: String(totalProducts), icon: Package, color: "text-amber-600 bg-amber-50" },
    { label: "Total Users", value: String(totalUsers), icon: Users, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-sage-100">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="font-display text-2xl font-bold text-neutral-900">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function RecentOrders() {
  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });
  } catch {}

  return (
    <Card className="border-sage-100">
      <CardContent className="p-6">
        <h2 className="font-display text-lg font-semibold text-neutral-900">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-400">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage-100 text-left text-neutral-500">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-sage-50">
                    <td className="py-3 font-medium text-neutral-900">#{order.orderNumber}</td>
                    <td className="py-3 text-neutral-600">{order.user.name || "N/A"}</td>
                    <td className="py-3">
                      <span className="inline-block rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-medium text-sage-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-neutral-900">
                      UGX {Number(order.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-neutral-500">Overview of your store.</p>
      </div>
      <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><div className="h-[120px] animate-pulse rounded-xl bg-sage-50" /></div>}>
        <AnalyticsCards />
      </Suspense>
      <Suspense fallback={<div className="h-[400px] animate-pulse rounded-xl bg-sage-50" />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

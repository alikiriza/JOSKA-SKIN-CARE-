import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ status?: string; page?: string }>;
const statuses = ["PENDING", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED"];

async function OrdersTable({ searchParams }: { searchParams: SearchParams }) {
  const { status, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
      include: { user: { select: { name: true, email: true } }, items: { select: { productName: true, qty: true } } },
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const statusCounts: Record<string, number> = { ALL: await db.order.count() };
  for (const s of statuses) {
    statusCounts[s] = await db.order.count({ where: { status: s as any } });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="text-sm text-neutral-500">{total} total</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/orders"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !status ? "bg-sage-600 text-white" : "bg-sage-50 text-neutral-600 hover:bg-sage-100"
          }`}
        >
          All ({statusCounts.ALL})
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/dashboard/orders?status=${s}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === s ? "bg-sage-600 text-white" : "bg-sage-50 text-neutral-600 hover:bg-sage-100"
            }`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()} ({statusCounts[s]})
          </Link>
        ))}
      </div>

      <Card className="border-sage-100">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-100 text-left">
                    <th className="px-6 py-4 font-medium text-neutral-500">Order</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Customer</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Items</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Status</th>
                    <th className="px-6 py-4 font-medium text-neutral-500 text-right">Total</th>
                    <th className="px-6 py-4 font-medium text-neutral-500 text-right">Date</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-sage-50 hover:bg-sage-50/50">
                      <td className="px-6 py-4 font-medium text-neutral-900">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="text-neutral-900">{order.user.name || "N/A"}</p>
                        <p className="text-xs text-neutral-400">{order.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{order.items.length}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "DELIVERED" ? "bg-success-50 text-success-600" :
                          order.status === "CANCELLED" ? "bg-error-50 text-error-600" :
                          "bg-sage-50 text-sage-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-neutral-900">
                        UGX {Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/dashboard/orders${status ? `?status=${status}&` : "?"}page=${p}`}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                p === currentPage ? "bg-sage-600 text-white" : "bg-white text-neutral-600 hover:bg-sage-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-sage-100" />
        <div className="flex gap-2">
          {[1,2,3,4,5,6,7].map((i) => <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-sage-50" />)}
        </div>
        <div className="h-[400px] animate-pulse rounded-xl bg-sage-50" />
      </div>
    }>
      <OrdersTable searchParams={searchParams} />
    </Suspense>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ status?: string }>;

async function DeliveriesList({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const deliveries = await db.delivery.findMany({
    where,
    orderBy: { assignedAt: "desc" },
    include: {
      order: { select: { orderNumber: true, total: true } },
      rider: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-neutral-900">Deliveries</h1>
      <Card className="border-sage-100">
        <CardContent className="p-0">
          {deliveries.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No deliveries yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-100 text-left">
                    <th className="px-6 py-4 font-medium text-neutral-500">Order</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Rider</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Status</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Assigned</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d) => (
                    <tr key={d.id} className="border-b border-sage-50 hover:bg-sage-50/50">
                      <td className="px-6 py-4 font-medium text-neutral-900">#{d.order.orderNumber}</td>
                      <td className="px-6 py-4 text-neutral-600">{d.rider.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-medium text-sage-700">
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {new Date(d.assignedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders/${d.orderId}`}>View Order</Link>
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
    </div>
  );
}

export default function DeliveriesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-[300px] animate-pulse rounded-xl bg-sage-50" />}>
      <DeliveriesList searchParams={searchParams} />
    </Suspense>
  );
}

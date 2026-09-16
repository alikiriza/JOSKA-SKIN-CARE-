import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string }>;
const statuses = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

async function RiderDeliveries({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [deliveries, statusCounts] = await Promise.all([
    db.delivery.findMany({
      where,
      orderBy: { assignedAt: "desc" },
      include: {
        order: { select: { orderNumber: true, total: true } },
        rider: { select: { name: true } },
      },
    }),
    Promise.all([
      db.delivery.count(),
      ...statuses.map((s) => db.delivery.count({ where: { status: s as any } })),
    ]),
  ]);

  const counts: Record<string, number> = { ALL: statusCounts[0] };
  statuses.forEach((s, i) => { counts[s] = statusCounts[i + 1]; });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-neutral-900">My Deliveries</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/rider"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !status ? "bg-sage-600 text-white" : "bg-sage-50 text-neutral-600 hover:bg-sage-100"
          }`}
        >
          All ({counts.ALL})
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/rider?status=${s}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === s ? "bg-sage-600 text-white" : "bg-sage-50 text-neutral-600 hover:bg-sage-100"
            }`}
          >
            {s.replace(/_/g, " ")} ({counts[s]})
          </Link>
        ))}
      </div>

      <Card className="border-sage-100">
        <CardContent className="p-0">
          {deliveries.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No deliveries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-100 text-left">
                    <th className="px-6 py-4 font-medium text-neutral-500">Order</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Status</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Assigned</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Total</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d) => (
                    <tr key={d.id} className="border-b border-sage-50 hover:bg-sage-50/50">
                      <td className="px-6 py-4 font-medium text-neutral-900">#{d.order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          d.status === "DELIVERED" ? "bg-success-50 text-success-600" :
                          d.status === "IN_TRANSIT" ? "bg-blue-50 text-blue-700" :
                          d.status === "PICKED_UP" ? "bg-amber-50 text-amber-700" :
                          "bg-sage-50 text-sage-700"
                        }`}>
                          {d.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {new Date(d.assignedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        UGX {Number(d.order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/rider/${d.id}`}>
                            Update <ArrowUpRight className="h-3 w-3 ml-1" />
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
    </div>
  );
}

export default function RiderPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-[400px] animate-pulse rounded-xl bg-sage-50" />}>
      <RiderDeliveries searchParams={searchParams} />
    </Suspense>
  );
}

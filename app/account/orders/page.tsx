import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

async function OrderHistory() {
  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { items: { select: { productName: true, qty: true } } },
    });
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">My Orders</h1>
        <p className="text-sm text-neutral-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      {orders.length === 0 ? (
        <Card className="border-sage-100">
          <CardContent className="py-12 text-center">
            <p className="text-neutral-500">No orders yet.</p>
            <Button asChild className="mt-4">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id} className="border-sage-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-neutral-900">
                      #{order.orderNumber}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">
                      UGX {Number(order.total).toFixed(2)}
                    </p>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${
                      order.status === "DELIVERED" ? "bg-success-50 text-success-600" :
                      order.status === "CANCELLED" ? "bg-error-50 text-error-600" :
                      "bg-sage-50 text-sage-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/order/confirmation/${order.id}`} className="gap-1">
                      View Details <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="h-[400px] animate-pulse rounded-xl bg-sage-50" />}>
      <OrderHistory />
    </Suspense>
  );
}

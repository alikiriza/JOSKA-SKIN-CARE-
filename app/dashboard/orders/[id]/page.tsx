import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { OrderStatusBadge } from "./order-status-badge";
import { StatusUpdateForm } from "./status-update-form";

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      items: true,
      address: true,
      delivery: { include: { rider: { select: { id: true, name: true } } } },
    },
  });
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/orders"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">Order #{order.orderNumber}</h1>
            <p className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Order Items</h2>
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-sage-50 pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-sage-50" />
                      <div>
                        <p className="font-medium text-neutral-900">{item.productName}</p>
                        <p className="text-sm text-neutral-500">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-medium text-neutral-900">UGX {Number(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>UGX {Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  <span>UGX {Number(order.deliveryFee).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-neutral-900">
                  <span>Total</span>
                  <span>UGX {Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Payment</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Method</span>
                  <span className="font-medium text-neutral-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status</span>
                  <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <StatusUpdateForm orderId={order.id} currentStatus={order.status} />

          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Customer</h2>
              <div className="mt-4 space-y-2 text-sm">
                <p className="font-medium text-neutral-900">{order.user.name || "N/A"}</p>
                <p className="text-neutral-500">{order.user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Shipping Address</h2>
              <div className="mt-4 space-y-1 text-sm text-neutral-600">
                <p>{order.address.fullName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.country}</p>
                {order.address.postalCode && <p>{order.address.postalCode}</p>}
              </div>
            </CardContent>
          </Card>

          {order.delivery && (
            <Card className="border-sage-100">
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold text-neutral-900">Delivery</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-neutral-500">Rider</span>
                    <span className="font-medium text-neutral-900">{order.delivery.rider.name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-500">Status</span>
                    <span className="font-medium">{order.delivery.status}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

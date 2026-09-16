import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { DeliveryStatusUpdate } from "./delivery-status-update";

type Props = { params: Promise<{ id: string }> };

export default async function DeliveryDetailPage({ params }: Props) {
  const { id } = await params;
  const delivery = await db.delivery.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          items: true,
          address: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!delivery) notFound();

  const timeline = [
    { status: "ASSIGNED", label: "Assigned", icon: Clock, time: delivery.assignedAt, done: true },
    { status: "PICKED_UP", label: "Picked Up", icon: Package, time: delivery.pickedUpAt, done: !!delivery.pickedUpAt },
    { status: "IN_TRANSIT", label: "In Transit", icon: Truck, time: delivery.inTransitAt, done: !!delivery.inTransitAt },
    { status: "DELIVERED", label: "Delivered", icon: CheckCircle, time: delivery.deliveredAt, done: !!delivery.deliveredAt },
  ];

  const statusOrder = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];
  const currentIdx = statusOrder.indexOf(delivery.status);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/rider"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Delivery #{delivery.order.orderNumber}
          </h1>
          <p className="text-sm text-neutral-500">
            {delivery.status.replace(/_/g, " ")} · Assigned {new Date(delivery.assignedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Delivery Timeline</h2>
              <div className="mt-6 space-y-0">
                {timeline.map((step, i) => {
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                      {i < timeline.length - 1 && (
                        <div className={`absolute left-[15px] top-8 w-0.5 h-full -translate-x-1/2 ${
                          step.done ? "bg-sage-600" : "bg-sage-200"
                        }`} />
                      )}
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        step.done ? "bg-sage-600 text-white" : isCurrent ? "bg-sage-100 text-sage-600" : "bg-sage-50 text-neutral-400"
                      }`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.done || isCurrent ? "text-neutral-900" : "text-neutral-400"}`}>
                          {step.label}
                        </p>
                        {step.time && (
                          <p className="text-sm text-neutral-500">{new Date(step.time).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <DeliveryStatusUpdate
            deliveryId={delivery.id}
            currentStatus={delivery.status}
            nextStatus={
              currentIdx < statusOrder.length - 1 ? statusOrder[currentIdx + 1] : null
            }
          />
        </div>

        <div className="space-y-6">
          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Order Items</h2>
              <div className="mt-4 space-y-3">
                {delivery.order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-sage-50 pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{item.productName}</p>
                      <p className="text-xs text-neutral-500">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-medium text-neutral-900">
                      UGX {Number(item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-sage-100 pt-3 flex justify-between font-semibold text-neutral-900">
                <span>Total</span>
                <span>UGX {Number(delivery.order.total).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Customer</h2>
              <div className="mt-4 space-y-1 text-sm">
                <p className="font-medium text-neutral-900">{delivery.order.user.name || "N/A"}</p>
                {delivery.order.address.phone && <p className="text-neutral-500">{delivery.order.address.phone}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Delivery Address</h2>
              <div className="mt-4 space-y-1 text-sm text-neutral-600">
                <p>{delivery.order.address.fullName}</p>
                <p>{delivery.order.address.street}</p>
                <p>{delivery.order.address.city}, {delivery.order.address.country}</p>
                {delivery.order.address.phone && <p>{delivery.order.address.phone}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

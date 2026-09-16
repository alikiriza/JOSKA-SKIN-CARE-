import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  let order: any = null;
  try {
    order = await db.order.findUnique({
      where: { id },
      include: { items: true, address: true },
    });
  } catch {}
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <CheckCircle className="mx-auto h-16 w-16 text-sage-600" />
      <h1 className="mt-6 font-display text-3xl font-bold text-neutral-900">Order Confirmed!</h1>
      <p className="mt-2 text-neutral-500">
        Thank you for your order. Your order number is <strong className="text-neutral-900">#{order.orderNumber}</strong>.
      </p>

      <Card className="mt-10 border-sage-100 text-left">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-neutral-900">Order Details</h2>
          <div className="space-y-3 text-sm">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-neutral-600">{item.productName} × {item.qty}</span>
                <span className="font-medium text-neutral-900">UGX {Number(item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-sage-100 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Total</span>
              <span className="font-semibold text-neutral-900">UGX {Number(order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Payment</span>
              <span>{order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Card (Stripe)"}</span>
            </div>
          </div>

          <div className="border-t border-sage-100 pt-3">
            <h3 className="text-sm font-medium text-neutral-900">Shipping To</h3>
            <p className="text-sm text-neutral-500 mt-1">
              {order.address.fullName}<br />
              {order.address.street}<br />
              {order.address.city}, {order.address.country}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link href="/account/orders">View My Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

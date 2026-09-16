"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/zustand-cart";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "CASH_ON_DELIVERY">("CASH_ON_DELIVERY");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ fullName: "", street: "", city: "", country: "Uganda", postalCode: "", phone: "" });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const deliveryFee = subtotal() >= 5000 ? 0 : 350;
  const total = subtotal() + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = paymentMethod === "CASH_ON_DELIVERY" ? "/api/checkout/cod" : "/api/checkout/stripe";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, qty: i.qty, price: i.price })),
          address,
          paymentMethod,
          deliveryFee,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      router.push(`/order/confirmation/${data.orderId}`);
    } catch (err: any) {
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/cart")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-3xl font-bold text-neutral-900">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-sage-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-sage-600" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-sage-600" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "STRIPE" | "CASH_ON_DELIVERY")}>
                <div className="flex items-center gap-3 rounded-lg border border-sage-100 p-4">
                  <RadioGroupItem value="CASH_ON_DELIVERY" id="cod" />
                  <Label htmlFor="cod" className="font-medium">Cash on Delivery</Label>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-sage-100 p-4">
                  <RadioGroupItem value="STRIPE" id="stripe" />
                  <Label htmlFor="stripe" className="font-medium">Card Payment (Stripe)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Order Summary</h2>
              <div className="mt-6 space-y-4">
                {items.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-sage-50" />
                      <span className="text-neutral-600">{item.name} × {item.qty}</span>
                    </div>
                    <span className="font-medium text-neutral-900">UGX {(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                {items.length > 4 && (
                  <p className="text-sm text-neutral-400">+{items.length - 4} more items</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>UGX {subtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "Free" : `UGX ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-neutral-900 text-base">
                  <span>Total</span>
                  <span>UGX {total.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" className="mt-6 w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Processing..." : `Place Order — UGX ${total.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

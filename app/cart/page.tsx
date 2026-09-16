"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { useCart } from "@/lib/zustand-cart";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, itemCount, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-neutral-300" />
        <h1 className="mt-6 font-display text-2xl font-bold text-neutral-900">Your cart is empty</h1>
        <p className="mt-2 text-neutral-500">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild className="mt-8">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Shopping Cart ({itemCount()})
        </h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-neutral-500">
          Clear Cart
        </Button>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border-sage-100">
              <CardContent className="flex gap-4 p-4 sm:gap-6">
                <div className="h-24 w-24 shrink-0 rounded-lg bg-sage-50 sm:h-28 sm:w-28" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-display font-semibold text-neutral-900 hover:text-sage-600"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      UGX {item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-sage-200 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center text-neutral-500 hover:text-neutral-900"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center text-sm font-medium text-neutral-900">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center text-neutral-500 hover:text-neutral-900"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-neutral-900">
                        UGX {(item.price * item.qty).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-error-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="border-sage-100">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Order Summary</h2>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal ({itemCount()} items)</span>
                  <span>UGX {subtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-medium text-neutral-900">
                <span>Total</span>
                <span>UGX {subtotal().toFixed(2)}</span>
              </div>
              <Button className="mt-6 w-full gap-2" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" className="mt-3 w-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}

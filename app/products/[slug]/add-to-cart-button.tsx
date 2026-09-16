"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/zustand-cart";
import type { CartItem } from "@/lib/zustand-cart";

type ProductData = {
  id: string;
  slug: string;
  name: string;
  price: { toString: () => string };
  images: string[];
  stock: number;
};

export function AddToCartButton({ product }: { product: ProductData }) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  const cartItem: Omit<CartItem, "qty"> = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price.toString()),
    image: product.images[0] || "",
    stock: product.stock,
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-lg border border-sage-200 bg-white">
        <button
          type="button"
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="flex h-10 w-10 items-center justify-center text-neutral-500 hover:text-neutral-900"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-neutral-900">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty(Math.min(product.stock, qty + 1))}
          className="flex h-10 w-10 items-center justify-center text-neutral-500 hover:text-neutral-900"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        onClick={() => {
          for (let i = 0; i < qty; i++) addItem(cartItem);
        }}
        className="gap-2"
      >
        <ShoppingCart className="h-4 w-4" /> Add to Cart — UGX {(Number(product.price.toString()) * qty).toFixed(2)}
      </Button>
    </div>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: Math.min(i.qty + 1, i.stock) } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "joska-cart" }
  )
);

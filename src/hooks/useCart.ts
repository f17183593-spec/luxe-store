import { useState, useCallback } from "react";
import type { CartItem } from "@/types/cart";

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });

  const addItem = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.items.find((i) => i.id === item.id);
      let newItems;

      if (existingItem) {
        newItems = prev.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prev.items, { ...item, quantity: 1 }];
      }

      return {
        items: newItems,
        totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0),
        totalPrice: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((i) => i.id !== id);
      return {
        items: newItems,
        totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0),
        totalPrice: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
      };
    });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      const newItems = prev.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, qty) } : i
      ).filter(i => i.quantity > 0);

      return {
        items: newItems,
        totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0),
        totalPrice: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
      };
    });
  }, []);

  return { cart, addItem, removeItem, updateQuantity };
}
"use client";

import { useState, useCallback } from "react";
import type { CartItem } from "@/types/cart";

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });

  const addItem = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
          totalItems: prev.totalItems + 1,
          totalPrice: prev.totalPrice + item.price,
        };
      }
      return {
        ...prev,
        items: [...prev.items, { ...item, quantity: 1 }],
        totalItems: prev.totalItems + 1,
        totalPrice: prev.totalPrice + item.price,
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => {
      const item = prev.items.find((i) => i.productId === productId);
      if (!item) return prev;
      return {
        ...prev,
        items: prev.items.filter((i) => i.productId !== productId),
        totalItems: prev.totalItems - item.quantity,
        totalPrice: prev.totalPrice - item.price * item.quantity,
      };
    });
  }, []);

  return { cart, addItem, removeItem };
}

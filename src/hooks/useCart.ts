import { useState, useCallback } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  [key: string]: any;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });

  const addItem = useCallback((item: any) => {
    setCart((prev) => {
      const itemId = item._id || item.id;
      const existingItem = prev.items.find((i) => i._id === itemId);
      let newItems;

      if (existingItem) {
        newItems = prev.items.map((i) =>
          i._id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prev.items, { ...item, _id: itemId, quantity: 1 }];
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
      const newItems = prev.items.filter((i) => i._id !== id);
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
        i._id === id ? { ...i, quantity: Math.max(0, qty) } : i
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
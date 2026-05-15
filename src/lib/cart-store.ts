import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  [key: string]: any;
}

export interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: CartItem | null;
  addItem: (item: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleDrawer: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      lastAddedItem: null,

      addItem: (item) => {
        set((state: any) => {
          const existing = state.items.find(
            (i: any) => i.productId === item.productId,
          );
          
          let newItems;
          if (existing) {
            newItems = state.items.map((i: any) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          } else {
            newItems = [...state.items, { ...item, quantity: 1 }];
          }

          return {
            items: newItems,
            lastAddedItem: { ...item, quantity: 1 }
          };
        });
      },

      removeItem: (productId) => {
        set((state: any) => ({
          items: state.items.filter((i: any) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state: any) => ({
          items: state.items
            .map((i: any) =>
              i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i
            )
            .filter((i: any) => i.quantity > 0),
        }));
      },

      toggleDrawer: () => {
        set((state: any) => ({ isDrawerOpen: !state.isDrawerOpen }));
      },

      clearCart: () => {
        set(() => ({ items: [], lastAddedItem: null }));
      },
    }),
    {
      name: "luxe-store-cart",
    }
  )
);
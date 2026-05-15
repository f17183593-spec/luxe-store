export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: CartItem | null;

  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  dismissLastAdded: () => void;

  totalItems: () => number;
  totalPrice: () => number;
}

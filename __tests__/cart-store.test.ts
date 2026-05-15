import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../src/lib/cart-store";
import type { CartItem } from "../src/types/cart";

function createMockItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: "prod-1",
    slug: "test-product",
    title: "Test Product",
    price: 50000,
    image: "/test.jpg",
    quantity: 1,
    ...overrides,
  };
}

describe("CartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isDrawerOpen: false, lastAddedItem: null });
  });

  it("starts with empty cart", () => {
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.isDrawerOpen).toBe(false);
    expect(state.lastAddedItem).toBeNull();
  });

  it("adds an item to the cart", () => {
    const item = createMockItem();
    useCartStore.getState().addItem(item);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]!.quantity).toBe(1);
    expect(state.items[0]!.title).toBe("Test Product");
  });

  it("increments quantity when adding duplicate item", () => {
    const item = createMockItem();
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]!.quantity).toBe(2);
  });

  it("tracks lastAddedItem", () => {
    const item = createMockItem();
    useCartStore.getState().addItem(item);

    const state = useCartStore.getState();
    expect(state.lastAddedItem).not.toBeNull();
    expect(state.lastAddedItem!.productId).toBe("prod-1");
  });

  it("dismisses lastAddedItem", () => {
    useCartStore.getState().addItem(createMockItem());
    useCartStore.getState().dismissLastAdded();

    expect(useCartStore.getState().lastAddedItem).toBeNull();
  });

  it("removes an item from cart", () => {
    const item1 = createMockItem({ productId: "prod-1" });
    const item2 = createMockItem({ productId: "prod-2", title: "Product 2" });

    useCartStore.getState().addItem(item1);
    useCartStore.getState().addItem(item2);

    useCartStore.getState().removeItem("prod-1");

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]!.productId).toBe("prod-2");
  });

  it("updates quantity", () => {
    useCartStore.getState().addItem(createMockItem());
    useCartStore.getState().updateQuantity("prod-1", 5);

    expect(useCartStore.getState().items[0]!.quantity).toBe(5);
  });

  it("removes item when quantity goes below 1", () => {
    useCartStore.getState().addItem(createMockItem());
    useCartStore.getState().updateQuantity("prod-1", 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clears entire cart", () => {
    useCartStore.getState().addItem(createMockItem({ productId: "prod-1" }));
    useCartStore.getState().addItem(createMockItem({ productId: "prod-2" }));
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("handles drawer open/close", () => {
    expect(useCartStore.getState().isDrawerOpen).toBe(false);

    useCartStore.getState().openDrawer();
    expect(useCartStore.getState().isDrawerOpen).toBe(true);

    useCartStore.getState().closeDrawer();
    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });

  it("persists items across store resets", () => {
    // Simulate persistence behavior: write items, then check partialize
    useCartStore.getState().addItem(createMockItem());

    const persisted = useCartStore.persist.getOptions().partialize?.(useCartStore.getState());
    expect(persisted).toHaveProperty("items");
    expect(persisted!.items).toHaveLength(1);
    expect(persisted).not.toHaveProperty("isDrawerOpen");
  });

  it("handles multiple items with different quantities", () => {
    useCartStore.getState().addItem(createMockItem({ productId: "p1", price: 10000 }));
    useCartStore.getState().addItem(createMockItem({ productId: "p1", price: 10000 }));
    useCartStore.getState().addItem(createMockItem({ productId: "p2", price: 20000 }));

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.items.find((i) => i.productId === "p1")!.quantity).toBe(2);
    expect(state.items.find((i) => i.productId === "p2")!.quantity).toBe(1);
  });
});

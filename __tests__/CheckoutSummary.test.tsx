import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckoutSummary } from "../src/components/cart/CheckoutSummary";
import { useCartStore } from "../src/lib/cart-store";
import { act } from "react";

describe("CheckoutSummary", () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], isDrawerOpen: false, lastAddedItem: null });
    });
  });

  it("shows empty state when no items", () => {
    render(<CheckoutSummary locale="en" />);
    expect(screen.getByText("No items in cart.")).toBeDefined();
  });

  it("displays cart items", () => {
    act(() => {
      useCartStore.getState().addItem({
        productId: "p1",
        slug: "luxe-ring",
        title: "Luxe Ring",
        price: 150000,
        image: "/ring.jpg",
        category: "Jewelry",
      });
    });

    render(<CheckoutSummary locale="en" />);
    expect(screen.getByText("Luxe Ring")).toBeDefined();
    expect(screen.getByText("$1,500")).toBeDefined();
  });

  it("calculates subtotal correctly", () => {
    act(() => {
      useCartStore.getState().addItem({
        productId: "p1",
        slug: "item-a",
        title: "Item A",
        price: 10000,
        image: "/a.jpg",
      });
      useCartStore.getState().addItem({
        productId: "p1",
        slug: "item-a",
        title: "Item A",
        price: 10000,
        image: "/a.jpg",
      });
      useCartStore.getState().addItem({
        productId: "p2",
        slug: "item-b",
        title: "Item B",
        price: 20000,
        image: "/b.jpg",
      });
    });

    render(<CheckoutSummary locale="en" />);
    // Item A x2 = $200, Item B = $200, total = $400
    expect(screen.getByText("$400")).toBeDefined();
  });
});

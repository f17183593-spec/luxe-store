import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartBadge } from "../src/components/cart/CartBadge";
import { useCartStore } from "../src/lib/cart-store";
import { act } from "react";

describe("CartBadge", () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], isDrawerOpen: false, lastAddedItem: null });
    });
  });

  it("renders without badge when cart is empty", () => {
    const { container } = render(<CartBadge />);
    // Should show aria-label saying 0 items
    const btn = screen.getByLabelText("Cart with 0 items");
    expect(btn).toBeDefined();
  });

  it("shows item count when items exist", () => {
    act(() => {
      useCartStore.getState().addItem({
        productId: "p1",
        slug: "test",
        title: "Test",
        price: 1000,
        image: "/test.jpg",
        quantity: 1,
      });
    });

    render(<CartBadge />);
    const badge = screen.getByText("1");
    expect(badge).toBeDefined();
  });

  it("shows 99+ for large counts", () => {
    act(() => {
      for (let i = 0; i < 100; i++) {
        useCartStore.getState().addItem({
          productId: `p-${i}`,
          slug: "test",
          title: `Product ${i}`,
          price: 1000,
          image: "/test.jpg",
        });
      }
    });

    render(<CartBadge />);
    const badge = screen.getByText("99+");
    expect(badge).toBeDefined();
  });
});

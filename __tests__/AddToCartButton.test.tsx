import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AddToCartButton } from "../src/components/cart/AddToCartButton";

describe("AddToCartButton", () => {
  const defaultProps = {
    productId: "prod-1",
    slug: "test-product",
    title: "Test Product",
    price: 50000,
    image: "/test.jpg",
  };

  it("renders the button text", () => {
    render(<AddToCartButton {...defaultProps} />);
    expect(screen.getByText("Add to Cart")).toBeDefined();
  });

  it("applies lg size class", () => {
    const { container } = render(
      <AddToCartButton {...defaultProps} size="lg" />,
    );
    const btn = container.querySelector("button");
    expect(btn!.className).toContain("text-base");
  });

  it("accepts custom className", () => {
    const { container } = render(
      <AddToCartButton {...defaultProps} className="custom-class" />,
    );
    const btn = container.querySelector("button");
    expect(btn!.className).toContain("custom-class");
  });
});
